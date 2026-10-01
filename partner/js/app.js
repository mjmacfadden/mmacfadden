/**
 * Main Application Controller for Partner
 * Manages multiple classes, rosters, pairing constraints, history, and user interactions.
 */

import { StorageManager } from './storage.js';
import { GroupingEngine } from './grouping.js';
import { detectGender } from './nameDatabase.js';

// Sample students for instant demo
const SAMPLE_STUDENTS = [
  'Alex Rivera',
  'Bailey Cooper',
  'Charlie Kim',
  'Dana Vance',
  'Ethan Hunt',
  'Fiona Gallagher',
  'Gabriel Stone',
  'Harper Lee',
  'Isaac Newton',
  'Julia Roberts',
  'Kai Chen',
  'Luna Lovegood'
];

class PartnerApp {
  constructor() {
    this.activeClass = StorageManager.getActiveClass();
    this.students = this.activeClass.students || [];
    this.history = this.activeClass.history || [];
    this.constraints = this.activeClass.constraints || [];
    this.settings = StorageManager.getSettings();

    this.selectedGroupSize = this.settings.defaultGroupSize || 2;
    this.sortByGender = !!this.activeClass.sortByGender;
    this.currentResult = null;

    this.genderActiveFilter = 'all';
    this.genderSearchQuery = '';

    // Auto-migrate ALL existing classes in StorageManager for colors and genders
    const appData = StorageManager.getAppData();
    let anyClassModified = false;
    appData.classes.forEach(cls => {
      const clsStudents = cls.students || [];
      let clsModified = false;

      // Ensure every student has a unique persistent color dividing the color wheel
      if (clsStudents.length > 0 && clsStudents.some(s => typeof s.hue !== 'number')) {
        const N = clsStudents.length;
        clsStudents.forEach((student, index) => {
          student.hue = Math.round((index * 360) / N);
        });
        clsModified = true;
      }

      // Auto-detect gender for existing students if not yet assigned
      clsStudents.forEach(s => {
        if (!s.gender) {
          const detected = detectGender(s.name);
          s.gender = detected.gender;
          s.genderCategory = detected.category;
          s.genderManual = false;
          clsModified = true;
        }
      });

      if (clsModified) {
        anyClassModified = true;
      }
    });

    if (anyClassModified) {
      StorageManager.saveAppData(appData);
      this.activeClass = StorageManager.getActiveClass();
      this.students = this.activeClass.students || [];
    }

    this.initDOM();
    this.initTheme();
    this.bindEvents();
    this.renderClassHeader();
    this.renderRoster();
    this.updateGenderUI();
    this.updateStatsAndPrediction();
    this.updateConstraintsBadges();

    // If there's history, restore the latest round display
    if (this.history.length > 0) {
      this.displayLastRoundFromHistory();
    }
  }

  /**
   * Cache DOM elements
   */
  initDOM() {
    // Header & Theme
    this.themeToggleBtn = document.getElementById('btn-toggle-theme');
    this.themeIconSun = document.getElementById('theme-icon-sun');
    this.btnOpenMatrix = document.getElementById('btn-open-matrix');
    this.btnOpenHistory = document.getElementById('btn-open-history');
    this.btnOpenSettings = document.getElementById('btn-open-settings');
    this.btnProjectorMode = document.getElementById('btn-projector-mode');
    this.historyCountBadge = document.getElementById('history-count-badge');

    // Class Switcher & Headers
    this.btnClassDropdown = document.getElementById('btn-class-dropdown');
    this.classDropdownMenu = document.getElementById('class-dropdown-menu');
    this.classDropdownList = document.getElementById('class-dropdown-list');
    this.currentClassNameHeader = document.getElementById('current-class-name-header');
    this.sidebarClassName = document.getElementById('sidebar-class-name');
    this.btnDropdownNewClass = document.getElementById('btn-dropdown-new-class');
    this.btnDropdownManageClasses = document.getElementById('btn-dropdown-manage-classes');
    this.btnManageClassesSidebar = document.getElementById('btn-manage-classes-sidebar');

    // Class Manager Modal
    this.modalClasses = document.getElementById('modal-classes');
    this.formCreateClass = document.getElementById('form-create-class');
    this.inputNewClassName = document.getElementById('input-new-class-name');
    this.classesListContainer = document.getElementById('classes-list-container');

    // Constraints Elements & Modal
    this.btnOpenConstraints = document.getElementById('btn-open-constraints');
    this.constraintsCountBadge = document.getElementById('constraints-count-badge');
    this.modalConstraints = document.getElementById('modal-constraints');
    this.constraintsClassName = document.getElementById('constraints-class-name');
    this.formAddConstraint = document.getElementById('form-add-constraint');
    this.selectStudent1 = document.getElementById('select-student-1');
    this.selectStudent2 = document.getElementById('select-student-2');
    this.selectConstraintType = document.getElementById('select-constraint-type');
    this.constraintsActiveCount = document.getElementById('constraints-active-count');
    this.constraintsListContainer = document.getElementById('constraints-list-container');

    // Input Tabs & Forms
    this.tabSingle = document.getElementById('tab-single');
    this.tabBulk = document.getElementById('tab-bulk');
    this.formSingle = document.getElementById('form-single');
    this.formBulk = document.getElementById('form-bulk');
    this.inputSingleName = document.getElementById('input-single-name');
    this.inputBulkNames = document.getElementById('input-bulk-names');
    this.btnLoadDemo = document.getElementById('btn-load-demo');
    this.btnEmptyLoadDemo = document.getElementById('btn-empty-load-demo');

    // Roster Elements
    this.countActive = document.getElementById('count-active');
    this.countTotal = document.getElementById('count-total');
    this.studentList = document.getElementById('student-list');
    this.btnSelectAll = document.getElementById('btn-select-all');
    this.btnDeselectAll = document.getElementById('btn-deselect-all');
    this.btnClearRoster = document.getElementById('btn-clear-roster');

    // Group Size Controls
    this.sizeButtons = document.querySelectorAll('.size-btn');
    this.inputCustomSize = document.getElementById('input-custom-size');
    this.checkboxSortGender = document.getElementById('checkbox-sort-gender');
    this.genderBreakdownHint = document.getElementById('gender-breakdown-hint');
    this.hintBoysCount = document.getElementById('hint-boys-count');
    this.hintGirlsCount = document.getElementById('hint-girls-count');
    this.hintUnassignedCount = document.getElementById('hint-unassigned-count');
    this.hintUnassignedWrapper = document.getElementById('hint-unassigned-wrapper');
    this.groupPrediction = document.getElementById('group-prediction');
    this.btnGenerateGroups = document.getElementById('btn-generate-groups');

    // Results Display
    this.resultsBar = document.getElementById('results-bar');
    this.roundIndicator = document.getElementById('round-indicator');
    this.repetitionBadge = document.getElementById('repetition-badge');
    this.constraintStatusBadge = document.getElementById('constraint-status-badge');
    this.btnCopyGroups = document.getElementById('btn-copy-groups');
    this.btnRegenerate = document.getElementById('btn-regenerate');
    this.groupsContainer = document.getElementById('groups-container');
    this.emptyState = document.getElementById('empty-state');

    // Coverage Bar
    this.coverageProgressBar = document.getElementById('coverage-progress-bar');
    this.coveragePercentageText = document.getElementById('coverage-percentage-text');
    this.coverageDetailText = document.getElementById('coverage-detail-text');
    this.cycleIndicatorText = document.getElementById('cycle-indicator-text');

    // Modals
    this.modalMatrix = document.getElementById('modal-matrix');
    this.modalHistory = document.getElementById('modal-history');
    this.modalSettings = document.getElementById('modal-settings');
    this.modalGenders = document.getElementById('modal-genders');
    this.matrixTable = document.getElementById('matrix-table');
    this.historyListContainer = document.getElementById('history-list-container');
    this.btnClearHistory = document.getElementById('btn-clear-history');
    this.btnExportJson = document.getElementById('btn-export-json');
    this.inputImportJson = document.getElementById('input-import-json');
    this.btnResetHistoryOnly = document.getElementById('btn-reset-history-only');
    this.btnResetAllData = document.getElementById('btn-reset-all-data');

    // Gender Manager Elements
    this.btnOpenGenders = document.getElementById('btn-open-genders');
    this.gendersPendingBadge = document.getElementById('genders-pending-badge');
    this.btnOpenGendersRoster = document.getElementById('btn-open-genders-roster');
    this.genderClassName = document.getElementById('gender-class-name');
    this.genderStatBoys = document.getElementById('gender-stat-boys');
    this.genderStatGirls = document.getElementById('gender-stat-girls');
    this.genderStatReview = document.getElementById('gender-stat-review');
    this.genderStatTotal = document.getElementById('gender-stat-total');
    this.genderTabBtns = document.querySelectorAll('.gender-tab-btn');
    this.tabCountAll = document.getElementById('tab-count-all');
    this.tabCountReview = document.getElementById('tab-count-review');
    this.tabCountNeutral = document.getElementById('tab-count-neutral');
    this.tabCountUnknown = document.getElementById('tab-count-unknown');
    this.tabCountBoys = document.getElementById('tab-count-boys');
    this.tabCountGirls = document.getElementById('tab-count-girls');
    this.inputGenderSearch = document.getElementById('input-gender-search');
    this.genderStudentsList = document.getElementById('gender-students-list');
    this.btnReautoDetectAll = document.getElementById('btn-reauto-detect-all');

    // Toast Container
    this.toastContainer = document.getElementById('toast-container');
  }

  /**
   * Theme Management
   */
  initTheme() {
    const savedTheme = this.settings.theme || 'system';
    this.applyTheme(savedTheme);
  }

  applyTheme(theme) {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.settings.theme = newTheme;
    StorageManager.saveSettings(this.settings);
    this.applyTheme(newTheme);
    this.showToast(`Theme switched to ${newTheme} mode`);
  }

  /**
   * Attach Event Listeners
   */
  bindEvents() {
    // Theme toggle
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // Class Picker & Dropdown
    this.btnClassDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleClassDropdown();
    });

    document.addEventListener('click', (e) => {
      if (!this.btnClassDropdown.contains(e.target) && !this.classDropdownMenu.contains(e.target)) {
        this.classDropdownMenu.style.display = 'none';
      }
    });

    this.btnDropdownNewClass.addEventListener('click', () => {
      this.classDropdownMenu.style.display = 'none';
      this.openClassesModal();
      setTimeout(() => this.inputNewClassName.focus(), 150);
    });

    this.btnDropdownManageClasses.addEventListener('click', () => {
      this.classDropdownMenu.style.display = 'none';
      this.openClassesModal();
    });

    this.btnManageClassesSidebar.addEventListener('click', () => {
      this.openClassesModal();
    });

    // Create Class Form
    this.formCreateClass.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.inputNewClassName.value.trim();
      if (name) {
        this.createClass(name);
        this.inputNewClassName.value = '';
      }
    });

    // Constraints & Rules
    this.btnOpenConstraints.addEventListener('click', () => this.openConstraintsModal());

    this.formAddConstraint.addEventListener('submit', (e) => {
      e.preventDefault();
      const s1 = this.selectStudent1.value;
      const s2 = this.selectStudent2.value;
      const type = this.selectConstraintType.value;
      if (s1 && s2 && type) {
        this.addConstraint(s1, s2, type);
      }
    });

    // Input Tabs
    this.tabSingle.addEventListener('click', () => this.switchInputTab('single'));
    this.tabBulk.addEventListener('click', () => this.switchInputTab('bulk'));

    // Add Single Form
    this.formSingle.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.inputSingleName.value.trim();
      if (name) {
        this.addStudent(name);
        this.inputSingleName.value = '';
        this.inputSingleName.focus();
      }
    });

    // Add Bulk Form
    this.formBulk.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawText = this.inputBulkNames.value;
      if (rawText) {
        this.addBulkStudents(rawText);
        this.inputBulkNames.value = '';
        this.switchInputTab('single');
      }
    });

    // Load Demo Data
    const loadDemoHandler = () => this.loadDemoClass();
    this.btnLoadDemo.addEventListener('click', loadDemoHandler);
    this.btnEmptyLoadDemo.addEventListener('click', loadDemoHandler);

    // Roster Bulk Actions
    this.btnSelectAll.addEventListener('click', () => this.toggleAllAttendance(true));
    this.btnDeselectAll.addEventListener('click', () => this.toggleAllAttendance(false));
    this.btnClearRoster.addEventListener('click', () => this.clearRoster());

    // Size Selector Buttons
    this.sizeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const size = parseInt(btn.dataset.size, 10);
        this.setSize(size);
      });
    });

    // Custom Size Input
    this.inputCustomSize.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (val && val >= 2) {
        this.setSize(val, true);
      }
    });

    // Generate Buttons
    this.btnGenerateGroups.addEventListener('click', () => this.generateGroups());
    this.btnRegenerate.addEventListener('click', () => this.generateGroups());
    this.btnCopyGroups.addEventListener('click', () => this.copyCurrentGroupsToClipboard());

    // Projector Mode
    this.btnProjectorMode.addEventListener('click', () => {
      const enabled = !document.body.classList.contains('projector-mode');
      this.toggleProjectorMode(enabled);
    });

    // Escape Key Handling (Closes open modals, exits projector mode & fullscreen)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.open');
        if (openModal) {
          this.closeModal(openModal);
        } else if (document.body.classList.contains('projector-mode')) {
          this.toggleProjectorMode(false);
        }
      }
    });

    // Synchronize Projector Mode when Fullscreen is exited (e.g. via browser native Esc key)
    const handleFullscreenChange = () => {
      const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      if (!isFullscreen && document.body.classList.contains('projector-mode')) {
        this.toggleProjectorMode(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Gender Sorting & Behind-the-Scenes Manager
    if (this.btnOpenGenders) {
      this.btnOpenGenders.addEventListener('click', () => this.openGenderModal());
    }
    if (this.btnOpenGendersRoster) {
      this.btnOpenGendersRoster.addEventListener('click', () => this.openGenderModal());
    }

    if (this.checkboxSortGender) {
      this.checkboxSortGender.addEventListener('change', (e) => {
        this.sortByGender = e.target.checked;
        this.activeClass.sortByGender = this.sortByGender;
        StorageManager.saveActiveClass(this.activeClass);
        this.updateGenderUI();
        this.updateStatsAndPrediction();
        if (this.sortByGender) {
          this.showToast('Sort by gender enabled (hidden from students)');
        }
      });
    }

    if (this.genderTabBtns) {
      this.genderTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.genderTabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.genderActiveFilter = btn.dataset.filter;
          this.renderGenderStudentsList();
        });
      });
    }

    if (this.inputGenderSearch) {
      this.inputGenderSearch.addEventListener('input', (e) => {
        this.genderSearchQuery = e.target.value.toLowerCase().trim();
        this.renderGenderStudentsList();
      });
    }

    if (this.btnReautoDetectAll) {
      this.btnReautoDetectAll.addEventListener('click', () => {
        let count = 0;
        this.students.forEach(s => {
          if (!s.genderManual) {
            const detected = detectGender(s.name);
            s.gender = detected.gender;
            s.genderCategory = detected.category;
            count++;
          }
        });
        this.persistStudents();
        this.updateGenderUI();
        this.renderGenderStudentsList();
        this.updateStatsAndPrediction();
        this.showToast(`Re-ran auto-detection on ${count} student(s)`);
      });
    }

    // Modals
    this.btnOpenMatrix.addEventListener('click', () => this.openMatrixModal());
    this.btnOpenHistory.addEventListener('click', () => this.openHistoryModal());
    this.btnOpenSettings.addEventListener('click', () => this.openModal(this.modalSettings));

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.dataset.close;
        if (modalId) {
          this.closeModal(document.getElementById(modalId));
        }
      });
    });

    // Close modal on backdrop click
    [this.modalMatrix, this.modalHistory, this.modalSettings, this.modalClasses, this.modalConstraints, this.modalGenders].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeModal(modal);
          }
        });
      }
    });

    // Settings actions
    this.btnClearHistory.addEventListener('click', () => this.clearHistory());
    this.btnResetHistoryOnly.addEventListener('click', () => this.clearHistory());
    this.btnResetAllData.addEventListener('click', () => this.factoryReset());
    this.btnExportJson.addEventListener('click', () => this.exportBackup());
    this.inputImportJson.addEventListener('change', (e) => this.importBackup(e));
  }

  /**
   * Render Class Headers and Dropdown
   */
  renderClassHeader() {
    const className = this.activeClass.name || 'Period 1';
    this.currentClassNameHeader.textContent = className;
    this.sidebarClassName.textContent = className;
    this.constraintsClassName.textContent = className;
  }

  toggleClassDropdown() {
    const isVisible = this.classDropdownMenu.style.display === 'block';
    if (isVisible) {
      this.classDropdownMenu.style.display = 'none';
    } else {
      this.renderClassDropdown();
      this.classDropdownMenu.style.display = 'block';
    }
  }

  renderClassDropdown() {
    const classes = StorageManager.getClasses();
    this.classDropdownList.innerHTML = '';

    classes.forEach(cls => {
      const btn = document.createElement('button');
      btn.className = `dropdown-item ${cls.id === this.activeClass.id ? 'active' : ''}`;

      const nameSpan = document.createElement('span');
      nameSpan.textContent = cls.name;
      nameSpan.style.overflow = 'hidden';
      nameSpan.style.textOverflow = 'ellipsis';
      nameSpan.style.whiteSpace = 'nowrap';

      const meta = document.createElement('span');
      meta.className = 'dropdown-item-meta';
      const studentCount = (cls.students || []).length;
      meta.textContent = `${studentCount} student${studentCount === 1 ? '' : 's'}`;

      btn.appendChild(nameSpan);
      btn.appendChild(meta);

      btn.addEventListener('click', () => {
        this.switchClass(cls.id);
        this.classDropdownMenu.style.display = 'none';
      });

      this.classDropdownList.appendChild(btn);
    });
  }

  /**
   * Open Class Manager Modal
   */
  openClassesModal() {
    this.renderClassesManagerList();
    this.openModal(this.modalClasses);
  }

  renderClassesManagerList() {
    const classes = StorageManager.getClasses();
    this.classesListContainer.innerHTML = '';

    classes.forEach(cls => {
      const isActive = cls.id === this.activeClass.id;
      const card = document.createElement('div');
      card.className = `class-row-card ${isActive ? 'active' : ''}`;

      const info = document.createElement('div');
      info.className = 'class-row-info';

      const name = document.createElement('div');
      name.className = 'class-row-name';
      name.textContent = cls.name;
      if (isActive) {
        const badge = document.createElement('span');
        badge.className = 'constraint-badge prefer';
        badge.style.marginLeft = '0.5rem';
        badge.style.fontSize = '0.7rem';
        badge.textContent = 'Active';
        name.appendChild(badge);
      }

      const meta = document.createElement('div');
      meta.className = 'class-row-meta';
      const studentCount = (cls.students || []).length;
      const historyCount = (cls.history || []).length;
      const rulesCount = (cls.constraints || []).length;
      meta.innerHTML = `
        <span>👥 ${studentCount} students</span>
        <span>•</span>
        <span>📜 ${historyCount} rounds</span>
        <span>•</span>
        <span>🛡️ ${rulesCount} rules</span>
      `;

      info.appendChild(name);
      info.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'class-row-actions';

      if (!isActive) {
        const switchBtn = document.createElement('button');
        switchBtn.className = 'btn btn-primary btn-xs';
        switchBtn.textContent = 'Switch';
        switchBtn.addEventListener('click', () => {
          this.switchClass(cls.id);
          this.renderClassesManagerList();
        });
        actions.appendChild(switchBtn);
      }

      const renameBtn = document.createElement('button');
      renameBtn.className = 'btn btn-secondary btn-xs';
      renameBtn.textContent = 'Rename';
      renameBtn.addEventListener('click', () => {
        const newName = prompt(`Rename class "${cls.name}":`, cls.name);
        if (newName && newName.trim() && newName.trim() !== cls.name) {
          StorageManager.renameClass(cls.id, newName.trim());
          if (cls.id === this.activeClass.id) {
            this.activeClass.name = newName.trim();
            this.renderClassHeader();
          }
          this.renderClassesManagerList();
          this.showToast(`Renamed class to "${newName.trim()}"`);
        }
      });
      actions.appendChild(renameBtn);

      const duplicateBtn = document.createElement('button');
      duplicateBtn.className = 'btn btn-secondary btn-xs';
      duplicateBtn.textContent = 'Copy';
      duplicateBtn.title = 'Duplicate class with same roster and rules';
      duplicateBtn.addEventListener('click', () => {
        const dup = StorageManager.duplicateClass(cls.id);
        if (dup) {
          this.switchClass(dup.id);
          this.renderClassesManagerList();
          this.showToast(`Duplicated class as "${dup.name}"`);
        }
      });
      actions.appendChild(duplicateBtn);

      if (classes.length > 1) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-xs';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Are you sure you want to delete class "${cls.name}"? This cannot be undone.`)) {
            const nextActive = StorageManager.deleteClass(cls.id);
            this.activeClass = nextActive;
            this.students = this.activeClass.students || [];
            this.history = this.activeClass.history || [];
            this.constraints = this.activeClass.constraints || [];
            this.renderClassHeader();
            this.renderRoster();
            this.updateStatsAndPrediction();
            this.updateConstraintsBadges();
            this.renderClassesManagerList();
            this.showToast(`Deleted class "${cls.name}"`);
          }
        });
        actions.appendChild(deleteBtn);
      }

      card.appendChild(info);
      card.appendChild(actions);
      this.classesListContainer.appendChild(card);
    });
  }

  createClass(name) {
    const newClass = StorageManager.createClass(name);
    this.switchClass(newClass.id);
    this.renderClassesManagerList();
    this.showToast(`Created and switched to "${newClass.name}"`);
  }

  switchClass(classId) {
    const target = StorageManager.switchClass(classId);
    if (!target) return;

    this.activeClass = target;
    this.students = this.activeClass.students || [];
    this.history = this.activeClass.history || [];
    this.constraints = this.activeClass.constraints || [];
    this.sortByGender = !!this.activeClass.sortByGender;
    this.currentResult = null;

    // Auto-detect gender for any students missing gender in this class
    let studentsModified = false;
    this.students.forEach(s => {
      if (!s.gender) {
        const detected = detectGender(s.name);
        s.gender = detected.gender;
        s.genderCategory = detected.category;
        s.genderManual = false;
        studentsModified = true;
      }
    });

    let colorsModified = false;
    if (this.students.length > 0 && this.students.some(s => typeof s.hue !== 'number')) {
      this.assignStudentColors();
      colorsModified = true;
    }

    if (studentsModified || colorsModified) {
      StorageManager.saveStudents(this.students);
    }

    this.renderClassHeader();
    this.renderRoster();
    this.updateGenderUI();
    this.updateStatsAndPrediction();
    this.updateConstraintsBadges();

    // Update result view
    if (this.history.length > 0) {
      this.displayLastRoundFromHistory();
    } else {
      this.groupsContainer.innerHTML = '';
      this.resultsBar.style.display = 'none';
      this.emptyState.style.display = 'block';
    }

    this.showToast(`Switched to ${this.activeClass.name}`);
  }

  /**
   * Pairing Constraints Management
   */
  openConstraintsModal() {
    this.constraintsClassName.textContent = this.activeClass.name;
    this.populateConstraintStudentSelects();
    this.renderConstraintsList();
    this.openModal(this.modalConstraints);
  }

  populateConstraintStudentSelects() {
    this.selectStudent1.innerHTML = '<option value="">Select Student 1...</option>';
    this.selectStudent2.innerHTML = '<option value="">Select Student 2...</option>';

    const sortedStudents = [...this.students].sort((a, b) => a.name.localeCompare(b.name));

    sortedStudents.forEach(s => {
      const opt1 = document.createElement('option');
      opt1.value = s.id;
      opt1.textContent = s.name + (s.active ? '' : ' (Absent)');
      this.selectStudent1.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = s.id;
      opt2.textContent = s.name + (s.active ? '' : ' (Absent)');
      this.selectStudent2.appendChild(opt2);
    });
  }

  addConstraint(studentId1, studentId2, type) {
    if (studentId1 === studentId2) {
      this.showToast('Please select two different students.');
      return;
    }

    const key = GroupingEngine.getPairKey(studentId1, studentId2);
    const existingIndex = this.constraints.findIndex(
      c => GroupingEngine.getPairKey(c.studentId1, c.studentId2) === key
    );

    if (existingIndex !== -1) {
      this.showToast('A pairing rule already exists for these two students.');
      return;
    }

    const newConstraint = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      studentId1,
      studentId2,
      type // 'avoid' | 'prefer'
    };

    this.constraints.push(newConstraint);
    this.persistConstraints();
    this.renderConstraintsList();
    this.updateConstraintsBadges();
    this.updateStatsAndPrediction();

    const s1 = this.students.find(s => s.id === studentId1)?.name || 'Student 1';
    const s2 = this.students.find(s => s.id === studentId2)?.name || 'Student 2';
    const typeLabel = type === 'avoid' ? 'Never Group' : 'Always Group';
    this.showToast(`Rule added: ${s1} & ${s2} (${typeLabel})`);

    // Reset selects
    this.selectStudent1.value = '';
    this.selectStudent2.value = '';
  }

  deleteConstraint(constraintId) {
    this.constraints = this.constraints.filter(c => c.id !== constraintId);
    this.persistConstraints();
    this.renderConstraintsList();
    this.updateConstraintsBadges();
    this.updateStatsAndPrediction();
    this.showToast('Pairing rule removed.');
  }

  renderConstraintsList() {
    this.constraintsListContainer.innerHTML = '';
    this.constraintsActiveCount.textContent = this.constraints.length;

    if (this.constraints.length === 0) {
      this.constraintsListContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 1.5rem; font-size: 0.85rem; background: var(--bg-card-alt); border-radius: var(--radius-md);">
          No pairing rules set for this class yet.<br>
          Select two students above to add an <strong>Avoid</strong> or <strong>Prefer</strong> rule.
        </div>
      `;
      return;
    }

    const studentMap = new Map();
    this.students.forEach(s => studentMap.set(s.id, s));

    this.constraints.forEach(c => {
      const s1 = studentMap.get(c.studentId1) || { name: 'Unknown Student' };
      const s2 = studentMap.get(c.studentId2) || { name: 'Unknown Student' };

      const card = document.createElement('div');
      card.className = 'constraint-item-card';

      const pairInfo = document.createElement('div');
      pairInfo.className = 'constraint-item-pair';

      const s1Span = document.createElement('strong');
      s1Span.textContent = s1.name;

      const badge = document.createElement('span');
      badge.className = `constraint-badge ${c.type}`;
      badge.textContent = c.type === 'avoid' ? '⛔ Never Pair' : '🔗 Always Pair';

      const s2Span = document.createElement('strong');
      s2Span.textContent = s2.name;

      pairInfo.appendChild(s1Span);
      pairInfo.appendChild(badge);
      pairInfo.appendChild(s2Span);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger btn-xs';
      deleteBtn.textContent = 'Remove';
      deleteBtn.addEventListener('click', () => this.deleteConstraint(c.id));

      card.appendChild(pairInfo);
      card.appendChild(deleteBtn);
      this.constraintsListContainer.appendChild(card);
    });
  }

  updateConstraintsBadges() {
    const count = this.constraints.length;
    this.constraintsCountBadge.textContent = count;
  }

  /**
   * Switch between single and bulk entry tabs
   */
  switchInputTab(mode) {
    if (mode === 'single') {
      this.tabSingle.classList.add('active');
      this.tabBulk.classList.remove('active');
      this.formSingle.style.display = 'flex';
      this.formBulk.style.display = 'none';
      this.inputSingleName.focus();
    } else {
      this.tabBulk.classList.add('active');
      this.tabSingle.classList.remove('active');
      this.formBulk.style.display = 'block';
      this.formSingle.style.display = 'none';
      this.inputBulkNames.focus();
    }
  }

  /**
   * Set target group size
   */
  setSize(size, isCustom = false) {
    this.selectedGroupSize = size;
    this.sizeButtons.forEach(btn => {
      const btnSize = parseInt(btn.dataset.size, 10);
      btn.classList.toggle('active', !isCustom && btnSize === size);
    });
    if (!isCustom) {
      this.inputCustomSize.value = '';
    }
    this.updateStatsAndPrediction();
  }

  /**
   * Add a single student
   */
  addStudent(name) {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (this.students.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      this.showToast(`Note: A student named "${trimmed}" is already on the roster.`);
    }

    const detected = detectGender(trimmed);

    const newStudent = {
      id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: trimmed,
      active: true,
      gender: detected.gender,
      genderCategory: detected.category,
      genderManual: false
    };

    this.students.push(newStudent);
    this.assignStudentColors();
    this.persistStudents();
    this.renderRoster();
    this.updateGenderUI();
    this.updateStatsAndPrediction();

    if (detected.gender === 'boy') {
      this.showToast(`Added ${trimmed} (Auto-assigned Boy)`);
    } else if (detected.gender === 'girl') {
      this.showToast(`Added ${trimmed} (Auto-assigned Girl)`);
    } else if (detected.category === 'neutral') {
      this.showToast(`Added ${trimmed} (Gender-neutral name, needs manual sorting)`);
    } else {
      this.showToast(`Added ${trimmed} (Not in top 3,000 names, needs manual sorting)`);
    }
  }

  /**
   * Add multiple students via CSV or multiline input
   */
  addBulkStudents(text) {
    const entries = text
      .split(/[,\n\r]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (entries.length === 0) {
      this.showToast('No valid names found in text.');
      return;
    }

    let addedCount = 0;
    let boysCount = 0;
    let girlsCount = 0;
    let needsSortingCount = 0;

    entries.forEach(name => {
      const detected = detectGender(name);
      if (detected.gender === 'boy') boysCount++;
      else if (detected.gender === 'girl') girlsCount++;
      else needsSortingCount++;

      const newStudent = {
        id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: name,
        active: true,
        gender: detected.gender,
        genderCategory: detected.category,
        genderManual: false
      };
      this.students.push(newStudent);
      addedCount++;
    });

    this.assignStudentColors();
    this.persistStudents();
    this.renderRoster();
    this.updateGenderUI();
    this.updateStatsAndPrediction();

    let msg = `Added ${addedCount} student${addedCount > 1 ? 's' : ''} (${boysCount} boys, ${girlsCount} girls`;
    if (needsSortingCount > 0) {
      msg += `, ${needsSortingCount} need manual sorting`;
    }
    msg += ')';
    this.showToast(msg);
  }

  /**
   * Populate with sample class names
   */
  loadDemoClass() {
    this.students = SAMPLE_STUDENTS.map(name => {
      const detected = detectGender(name);
      return {
        id: 's_' + Math.random().toString(36).substr(2, 9),
        name: name,
        active: true,
        gender: detected.gender,
        genderCategory: detected.category,
        genderManual: false
      };
    });
    this.assignStudentColors();
    this.persistStudents();
    this.renderRoster();
    this.updateGenderUI();
    this.updateStatsAndPrediction();
    this.showToast('Loaded 12 sample students with auto-assigned genders!');
  }

  /**
   * Toggle student attendance/active state
   */
  toggleStudentActive(id) {
    const student = this.students.find(s => s.id === id);
    if (student) {
      student.active = !student.active;
      this.persistStudents();
      this.renderRoster();
      this.updateGenderUI();
      this.updateStatsAndPrediction();
    }
  }

  /**
   * Toggle all students active/inactive
   */
  toggleAllAttendance(active) {
    this.students.forEach(s => s.active = active);
    this.persistStudents();
    this.renderRoster();
    this.updateGenderUI();
    this.updateStatsAndPrediction();
    this.showToast(active ? 'All students marked active' : 'All students marked inactive');
  }

  /**
   * Edit student name
   */
  editStudent(id) {
    const student = this.students.find(s => s.id === id);
    if (!student) return;

    const newName = prompt(`Edit name for "${student.name}":`, student.name);
    if (!newName || !newName.trim() || newName.trim() === student.name) {
      return;
    }

    const oldName = student.name;
    const trimmed = newName.trim();
    student.name = trimmed;

    // If gender wasn't manually set, re-detect gender for the new name
    if (!student.genderManual) {
      const detected = detectGender(trimmed);
      student.gender = detected.gender;
      student.genderCategory = detected.category;
    }

    this.persistStudents();

    // Update student name in history records for current class
    if (this.history && this.history.length > 0) {
      this.history.forEach(round => {
        if (round.studentNames && round.studentNames[id]) {
          round.studentNames[id] = trimmed;
        }
      });
      this.persistHistory();
    }

    this.renderRoster();
    this.updateGenderUI();
    this.updateStatsAndPrediction();
    this.updateConstraintsBadges();

    // If gender modal is open, re-render it
    if (this.modalGenders && this.modalGenders.classList.contains('active')) {
      this.renderGenderStudentsList();
    }

    // If pairings are currently displayed, refresh groups display with updated name
    if (this.currentResult) {
      this.renderGeneratedGroups(this.currentResult, this.history.length);
    }

    this.showToast(`Renamed "${oldName}" to "${trimmed}"`);
  }

  /**
   * Delete single student
   */
  deleteStudent(id) {
    const student = this.students.find(s => s.id === id);
    const name = student ? student.name : 'Student';
    this.students = this.students.filter(s => s.id !== id);
    this.assignStudentColors();
    this.persistStudents();
    this.renderRoster();
    this.updateGenderUI();
    this.updateStatsAndPrediction();
    this.updateConstraintsBadges();
    this.showToast(`Removed ${name}`);
  }

  /**
   * Clear roster
   */
  clearRoster() {
    if (this.students.length === 0) return;
    if (confirm('Are you sure you want to clear all students from the roster?')) {
      this.students = [];
      this.persistStudents();
      this.renderRoster();
      this.updateGenderUI();
      this.updateStatsAndPrediction();
      this.updateConstraintsBadges();
      this.showToast('Roster cleared');
    }
  }

  /**
   * Render Roster List in Sidebar
   */
  renderRoster() {
    this.studentList.innerHTML = '';
    const activeCount = this.students.filter(s => s.active).length;
    const totalCount = this.students.length;

    this.countActive.textContent = activeCount;
    this.countTotal.textContent = totalCount;

    this.students.forEach(student => {
      const li = document.createElement('li');
      li.className = `student-item ${student.active ? '' : 'inactive'}`;

      const left = document.createElement('div');
      left.className = 'student-item-left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'student-checkbox';
      checkbox.checked = student.active;
      checkbox.title = student.active ? 'Mark absent' : 'Mark active';
      checkbox.addEventListener('change', () => this.toggleStudentActive(student.id));

      const avatarSpan = document.createElement('span');
      avatarSpan.className = 'roster-student-avatar';
      avatarSpan.textContent = this.getInitials(student.name);
      const colorObj = this.getStudentColor(student);
      avatarSpan.style.background = colorObj.background;
      avatarSpan.style.color = colorObj.textColor;
      if (colorObj.border) {
        avatarSpan.style.border = colorObj.border;
      }

      const nameSpan = document.createElement('span');
      nameSpan.className = 'student-name';
      nameSpan.textContent = student.name;
      nameSpan.title = 'Click to toggle presence';
      nameSpan.addEventListener('click', () => this.toggleStudentActive(student.id));

      left.appendChild(checkbox);
      left.appendChild(avatarSpan);
      left.appendChild(nameSpan);

      const actions = document.createElement('div');
      actions.className = 'student-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'student-edit-btn';
      editBtn.title = 'Edit student name';
      editBtn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" style="width: 1rem; height: 1rem;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      `;
      editBtn.addEventListener('click', () => this.editStudent(student.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'student-delete-btn';
      deleteBtn.title = 'Delete student';
      deleteBtn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" style="width: 1rem; height: 1rem;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      `;
      deleteBtn.addEventListener('click', () => this.deleteStudent(student.id));

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      li.appendChild(left);
      li.appendChild(actions);

      this.studentList.appendChild(li);
    });
  }

  /**
   * Assign persistent colors from the color wheel to all students on the roster.
   * Divides the 360° color wheel evenly by total students so every student has a unique color.
   */
  assignStudentColors() {
    const N = this.students.length;
    if (N === 0) return;

    this.students.forEach((student, index) => {
      const hue = Math.round((index * 360) / N);
      student.hue = hue;
    });
  }

  /**
   * Get the styling object for a student's avatar circle
   * @param {Object|string} studentOrId - student object or student ID
   * @returns {{ background: string, textColor: string, hue: number, border: string }}
   */
  getStudentColor(studentOrId) {
    let student = null;
    if (typeof studentOrId === 'string') {
      student = this.students.find(s => s.id === studentOrId);
    } else if (studentOrId && studentOrId.id) {
      student = this.students.find(s => s.id === studentOrId.id) || studentOrId;
    } else if (studentOrId) {
      student = studentOrId;
    }

    let hue = 210;
    if (student && typeof student.hue === 'number') {
      hue = student.hue;
    } else {
      const id = student?.id || (typeof studentOrId === 'string' ? studentOrId : '');
      const idx = this.students.findIndex(s => s.id === id);
      if (idx !== -1 && this.students.length > 0) {
        hue = Math.round((idx * 360) / this.students.length);
      } else {
        let hash = 0;
        const str = student?.name || id || 'student';
        for (let i = 0; i < str.length; i++) {
          hash = (hash * 31 + str.charCodeAt(i)) % 360;
        }
        hue = Math.abs(hash);
      }
    }

    // Determine high-contrast text color based on hue luminance
    // Hues between 40° and 185° (yellows, limes, cyans) need dark text for readability
    const isLightHue = hue >= 40 && hue <= 185;
    const textColor = isLightHue ? '#0f172a' : '#ffffff';
    const bg = `linear-gradient(135deg, hsl(${hue}, 80%, 52%), hsl(${hue}, 70%, 42%))`;

    return {
      background: bg,
      textColor: textColor,
      hue: hue,
      border: isLightHue ? '1px solid rgba(0, 0, 0, 0.15)' : '1px solid rgba(255, 255, 255, 0.2)'
    };
  }

  /**
   * Update Behind-the-Scenes Gender UI Elements & Badges
   */
  updateGenderUI() {
    if (this.checkboxSortGender) {
      this.checkboxSortGender.checked = !!this.sortByGender;
    }
    if (this.genderBreakdownHint) {
      this.genderBreakdownHint.style.display = this.sortByGender ? 'flex' : 'none';
    }

    const totalStudents = this.students.length;
    const boysTotal = this.students.filter(s => s.gender === 'boy').length;
    const girlsTotal = this.students.filter(s => s.gender === 'girl').length;
    const neutralTotal = this.students.filter(s => s.gender === 'neutral').length;
    const unknownTotal = this.students.filter(s => s.gender === 'unknown').length;
    const reviewTotal = neutralTotal + unknownTotal;

    const active = this.students.filter(s => s.active);
    const activeBoys = active.filter(s => s.gender === 'boy').length;
    const activeGirls = active.filter(s => s.gender === 'girl').length;
    const activeReview = active.filter(s => s.gender !== 'boy' && s.gender !== 'girl').length;

    // Update pending badge in header
    if (this.gendersPendingBadge) {
      this.gendersPendingBadge.textContent = reviewTotal;
      this.gendersPendingBadge.classList.toggle('has-pending', reviewTotal > 0);
    }

    // Update sidebar breakdown hint
    if (this.hintBoysCount) this.hintBoysCount.textContent = activeBoys;
    if (this.hintGirlsCount) this.hintGirlsCount.textContent = activeGirls;
    if (this.hintUnassignedCount) this.hintUnassignedCount.textContent = activeReview;
    if (this.hintUnassignedWrapper) {
      this.hintUnassignedWrapper.style.display = activeReview > 0 ? 'inline' : 'none';
    }

    // Update modal elements if present
    if (this.genderClassName) {
      this.genderClassName.textContent = this.activeClass.name || 'Period 1';
    }
    if (this.genderStatBoys) this.genderStatBoys.textContent = boysTotal;
    if (this.genderStatGirls) this.genderStatGirls.textContent = girlsTotal;
    if (this.genderStatReview) this.genderStatReview.textContent = reviewTotal;
    if (this.genderStatTotal) this.genderStatTotal.textContent = totalStudents;

    if (this.genderCardReview) {
      this.genderCardReview.classList.toggle('warning', reviewTotal > 0);
    }

    if (this.tabCountAll) this.tabCountAll.textContent = totalStudents;
    if (this.tabCountReview) this.tabCountReview.textContent = reviewTotal;
    if (this.tabCountNeutral) this.tabCountNeutral.textContent = neutralTotal;
    if (this.tabCountUnknown) this.tabCountUnknown.textContent = unknownTotal;
    if (this.tabCountBoys) this.tabCountBoys.textContent = boysTotal;
    if (this.tabCountGirls) this.tabCountGirls.textContent = girlsTotal;
  }

  /**
   * Open Behind-the-Scenes Gender Management Modal
   */
  openGenderModal() {
    this.updateGenderUI();
    this.genderActiveFilter = 'all';
    if (this.genderTabBtns) {
      this.genderTabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all');
      });
    }
    if (this.inputGenderSearch) {
      this.inputGenderSearch.value = '';
    }
    this.genderSearchQuery = '';
    this.renderGenderStudentsList();
    this.openModal(this.modalGenders);
  }

  /**
   * Render Student List inside Gender Management Modal
   */
  renderGenderStudentsList() {
    if (!this.genderStudentsList) return;
    this.genderStudentsList.innerHTML = '';

    let filtered = [...this.students];

    // Tab filter
    if (this.genderActiveFilter === 'review') {
      filtered = filtered.filter(s => s.gender !== 'boy' && s.gender !== 'girl');
    } else if (this.genderActiveFilter === 'neutral') {
      filtered = filtered.filter(s => s.gender === 'neutral' || (!s.genderManual && s.genderCategory === 'neutral'));
    } else if (this.genderActiveFilter === 'unknown') {
      filtered = filtered.filter(s => s.gender === 'unknown' || (!s.genderManual && s.genderCategory === 'unknown'));
    } else if (this.genderActiveFilter === 'boy') {
      filtered = filtered.filter(s => s.gender === 'boy');
    } else if (this.genderActiveFilter === 'girl') {
      filtered = filtered.filter(s => s.gender === 'girl');
    }

    // Search query
    if (this.genderSearchQuery) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(this.genderSearchQuery));
    }

    if (filtered.length === 0) {
      this.genderStudentsList.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 2rem; font-size: 0.85rem; background: var(--bg-card-alt); border-radius: var(--radius-md);">
          No students match the current filter or search.
        </div>
      `;
      return;
    }

    // Sort: unassigned / review first, then alphabetical
    filtered.sort((a, b) => {
      const aNeeds = (a.gender !== 'boy' && a.gender !== 'girl') ? 0 : 1;
      const bNeeds = (b.gender !== 'boy' && b.gender !== 'girl') ? 0 : 1;
      if (aNeeds !== bNeeds) return aNeeds - bNeeds;
      return a.name.localeCompare(b.name);
    });

    filtered.forEach(student => {
      const card = document.createElement('div');
      card.className = 'gender-student-card';

      const info = document.createElement('div');
      info.className = 'gender-student-info';

      const nameRow = document.createElement('div');
      nameRow.style.display = 'flex';
      nameRow.style.alignItems = 'center';
      nameRow.style.gap = '0.5rem';

      const avatarSpan = document.createElement('span');
      avatarSpan.className = 'roster-student-avatar';
      avatarSpan.textContent = this.getInitials(student.name);
      const colorObj = this.getStudentColor(student);
      avatarSpan.style.background = colorObj.background;
      avatarSpan.style.color = colorObj.textColor;
      if (colorObj.border) {
        avatarSpan.style.border = colorObj.border;
      }
      nameRow.appendChild(avatarSpan);

      const nameSpan = document.createElement('span');
      nameSpan.className = 'gender-student-name';
      nameSpan.textContent = student.name;
      nameRow.appendChild(nameSpan);

      const editBtn = document.createElement('button');
      editBtn.className = 'student-edit-btn';
      editBtn.title = 'Edit student name';
      editBtn.style.padding = '0.15rem';
      editBtn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" style="width: 0.85rem; height: 0.85rem;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      `;
      editBtn.addEventListener('click', () => this.editStudent(student.id));
      nameRow.appendChild(editBtn);

      if (!student.active) {
        const absentBadge = document.createElement('span');
        absentBadge.style.fontSize = '0.7rem';
        absentBadge.style.color = 'var(--text-light)';
        absentBadge.textContent = '(Absent)';
        nameRow.appendChild(absentBadge);
      }

      // Detection & Category badge
      const badge = document.createElement('span');
      if (student.gender === 'boy') {
        badge.className = 'gender-category-badge boy';
        badge.textContent = student.genderManual ? '👦 Boy (Manual)' : '👦 Auto-assigned (Boy)';
      } else if (student.gender === 'girl') {
        badge.className = 'gender-category-badge girl';
        badge.textContent = student.genderManual ? '👧 Girl (Manual)' : '👧 Auto-assigned (Girl)';
      } else if (student.gender === 'neutral' || student.genderCategory === 'neutral') {
        badge.className = 'gender-category-badge neutral';
        badge.textContent = '⚖️ Gender-Neutral Name (Needs Sorting)';
      } else {
        badge.className = 'gender-category-badge unknown';
        badge.textContent = '🔍 Not in Top 3,000 (Needs Sorting)';
      }

      info.appendChild(nameRow);
      info.appendChild(badge);

      // Actions: Segmented control [ Boy ] [ Girl ]
      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.alignItems = 'center';
      actions.style.gap = '0.5rem';

      const seg = document.createElement('div');
      seg.className = 'gender-segmented-control';

      const boyBtn = document.createElement('button');
      boyBtn.className = `gender-seg-btn ${student.gender === 'boy' ? 'active boy' : ''}`;
      boyBtn.textContent = '👦 Boy';
      boyBtn.title = 'Assign as Boy';
      boyBtn.addEventListener('click', () => {
        student.gender = 'boy';
        student.genderManual = true;
        this.persistStudents();
        this.updateGenderUI();
        this.renderGenderStudentsList();
        this.updateStatsAndPrediction();
      });

      const girlBtn = document.createElement('button');
      girlBtn.className = `gender-seg-btn ${student.gender === 'girl' ? 'active girl' : ''}`;
      girlBtn.textContent = '👧 Girl';
      girlBtn.title = 'Assign as Girl';
      girlBtn.addEventListener('click', () => {
        student.gender = 'girl';
        student.genderManual = true;
        this.persistStudents();
        this.updateGenderUI();
        this.renderGenderStudentsList();
        this.updateStatsAndPrediction();
      });

      seg.appendChild(boyBtn);
      seg.appendChild(girlBtn);
      actions.appendChild(seg);

      if (student.genderManual) {
        const resetBtn = document.createElement('button');
        resetBtn.className = 'gender-reset-btn';
        resetBtn.textContent = 'Auto';
        resetBtn.title = 'Reset to 3,000 common names auto-detection';
        resetBtn.addEventListener('click', () => {
          const detected = detectGender(student.name);
          student.gender = detected.gender;
          student.genderCategory = detected.category;
          student.genderManual = false;
          this.persistStudents();
          this.updateGenderUI();
          this.renderGenderStudentsList();
          this.updateStatsAndPrediction();
        });
        actions.appendChild(resetBtn);
      }

      card.appendChild(info);
      card.appendChild(actions);
      this.genderStudentsList.appendChild(card);
    });
  }

  /**
   * Update Prediction Text & Pairing Progress
   */
  updateStatsAndPrediction() {
    const active = this.students.filter(s => s.active);
    const N = active.length;
    const K = this.selectedGroupSize;

    if (N < 2) {
      this.groupPrediction.textContent = 'Add at least 2 active students to generate groups.';
    } else if (this.sortByGender) {
      const activeBoys = active.filter(s => s.gender === 'boy');
      const activeGirls = active.filter(s => s.gender === 'girl');
      const activeUnassigned = active.filter(s => s.gender !== 'boy' && s.gender !== 'girl');

      const bSizes = GroupingEngine.calculateBalancedGroupSizes(activeBoys.length, K);
      const gSizes = GroupingEngine.calculateBalancedGroupSizes(activeGirls.length, K);
      const allSizes = [...bSizes, ...gSizes];

      const sizeCounts = {};
      allSizes.forEach(s => sizeCounts[s] = (sizeCounts[s] || 0) + 1);

      const parts = Object.entries(sizeCounts)
        .map(([size, count]) => {
          let label = size === '2' ? 'pair' : size === '3' ? 'trio' : size === '4' ? 'quad' : `group of ${size}`;
          if (count > 1) label += 's';
          return `${count} ${label}`;
        });

      let ruleText = '';
      if (this.constraints.length > 0) {
        ruleText = ` with <strong>${this.constraints.length} rule${this.constraints.length > 1 ? 's' : ''}</strong> applied`;
      }

      let unassignedWarn = '';
      if (activeUnassigned.length > 0) {
        unassignedWarn = `<br><span style="color: var(--warning-text); font-size: 0.75rem;">⚠️ ${activeUnassigned.length} active student${activeUnassigned.length > 1 ? 's' : ''} need manual gender sorting.</span>`;
      }

      this.groupPrediction.innerHTML = `<strong>${N} active students (${activeBoys.length} boys, ${activeGirls.length} girls)</strong> sorted by gender will form <strong>${parts.join(' and ')}</strong>${ruleText}.${unassignedWarn}`;
    } else {
      const sizes = GroupingEngine.calculateBalancedGroupSizes(N, K);
      const sizeCounts = {};
      sizes.forEach(s => sizeCounts[s] = (sizeCounts[s] || 0) + 1);

      const parts = Object.entries(sizeCounts)
        .map(([size, count]) => {
          let label = size === '2' ? 'pair' : size === '3' ? 'trio' : size === '4' ? 'quad' : `group of ${size}`;
          if (count > 1) label += 's';
          return `${count} ${label}`;
        });

      let ruleText = '';
      if (this.constraints.length > 0) {
        ruleText = ` with <strong>${this.constraints.length} rule${this.constraints.length > 1 ? 's' : ''}</strong> applied`;
      }

      this.groupPrediction.innerHTML = `<strong>${N} active students</strong> will form <strong>${parts.join(' and ')}</strong>${ruleText}.`;
    }

    // Update History Badge
    this.historyCountBadge.textContent = this.history.length;

    // Update Coverage Card
    const stats = GroupingEngine.calculateStats(active, this.history, this.constraints);
    this.coveragePercentageText.textContent = `${stats.coveragePercent}%`;
    this.coverageProgressBar.style.width = `${stats.coveragePercent}%`;
    this.coverageDetailText.textContent = `${stats.metPairs} of ${stats.totalPossiblePairs} unique pairs have worked together`;
    this.cycleIndicatorText.textContent = `Cycle ${stats.cycleNumber}`;
  }

  /**
   * Generate Groups
   */
  generateGroups() {
    const activeStudents = this.students.filter(s => s.active);
    if (activeStudents.length < 2) {
      this.showToast('Please have at least 2 active students to create groups.');
      return;
    }

    if (this.sortByGender) {
      const activeUnassigned = activeStudents.filter(s => s.gender !== 'boy' && s.gender !== 'girl');
      if (activeUnassigned.length > 0) {
        this.showToast(`Notice: ${activeUnassigned.length} unassigned student(s) auto-balanced into gender groups.`);
      }
    }

    const result = GroupingEngine.generateGroups(
      activeStudents,
      this.selectedGroupSize,
      this.history,
      this.constraints,
      { sortByGender: this.sortByGender }
    );

    this.currentResult = result;

    // Record round in history
    const roundRecord = {
      id: 'round_' + Date.now(),
      timestamp: Date.now(),
      groupSize: this.selectedGroupSize,
      sortByGender: !!this.sortByGender,
      groups: result.groupIds,
      studentNames: Object.fromEntries(activeStudents.map(s => [s.id, s.name])),
      cost: result.cost,
      repeatPairsCount: result.repeatPairsCount,
      avoidViolations: result.avoidViolations || 0,
      preferSatisfied: result.preferSatisfied || 0,
      preferTotal: result.preferTotal || 0
    };

    this.history.push(roundRecord);
    this.persistHistory();

    // Render Results
    this.renderGeneratedGroups(result, this.history.length);
    this.updateStatsAndPrediction();

    // Friendly feedback
    if (result.avoidViolations > 0) {
      this.showToast(`⚠️ Warning: ${result.avoidViolations} Avoid rule(s) could not be mathematically satisfied.`);
    } else if (result.repeatPairsCount === 0) {
      if (this.sortByGender) {
        this.showToast('🎉 Generated single-gender groups with all rules respected!');
      } else {
        this.showToast('🎉 Generated fresh non-repeating groups with all rules respected!');
      }
    } else {
      this.showToast(`Generated groups (${result.repeatPairsCount} previous pairing${result.repeatPairsCount > 1 ? 's' : ''} repeated).`);
    }
  }

  /**
   * Display latest round from history on page load or class switch
   */
  displayLastRoundFromHistory() {
    const lastRound = this.history[this.history.length - 1];
    if (!lastRound || !lastRound.groups) return;

    const studentMap = new Map();
    this.students.forEach(s => studentMap.set(s.id, s));

    const enrichedGroups = lastRound.groups.map(group => {
      return group.map(id => {
        return studentMap.get(id) || { id, name: lastRound.studentNames?.[id] || id };
      });
    });

    const mockResult = {
      groups: enrichedGroups,
      groupIds: lastRound.groups,
      groupSizes: lastRound.groups.map(g => g.length),
      repeatPairsCount: lastRound.repeatPairsCount || 0,
      avoidViolations: lastRound.avoidViolations || 0,
      preferSatisfied: lastRound.preferSatisfied || 0,
      preferTotal: lastRound.preferTotal || 0
    };

    this.currentResult = mockResult;
    this.renderGeneratedGroups(mockResult, this.history.length);
  }

  /**
   * Render Groups to Grid
   */
  renderGeneratedGroups(result, roundNumber = 1) {
    this.emptyState.style.display = 'none';
    this.resultsBar.style.display = 'flex';
    this.groupsContainer.innerHTML = '';

    this.roundIndicator.textContent = `Round #${roundNumber}`;

    if (result.repeatPairsCount === 0) {
      this.repetitionBadge.className = 'status-badge fresh';
      this.repetitionBadge.innerHTML = '✨ 100% Fresh Pairings (0 repeats)';
    } else {
      this.repetitionBadge.className = 'status-badge repeats';
      this.repetitionBadge.innerHTML = `🔄 ${result.repeatPairsCount} repeat pairing${result.repeatPairsCount > 1 ? 's' : ''}`;
    }

    // Constraint status badge
    if (result.avoidViolations && result.avoidViolations > 0) {
      this.constraintStatusBadge.style.display = 'inline-flex';
      this.constraintStatusBadge.className = 'status-badge constraints-warning';
      this.constraintStatusBadge.innerHTML = `⚠️ ${result.avoidViolations} Avoid Conflict`;
    } else if (this.constraints.length > 0) {
      this.constraintStatusBadge.style.display = 'inline-flex';
      this.constraintStatusBadge.className = 'status-badge constraints-ok';
      this.constraintStatusBadge.innerHTML = `🛡️ ${this.constraints.length} Rule${this.constraints.length > 1 ? 's' : ''} Enforced`;
    } else {
      this.constraintStatusBadge.style.display = 'none';
    }

    result.groups.forEach((group, groupIdx) => {
      const card = document.createElement('div');
      card.className = 'group-card';

      const header = document.createElement('div');
      header.className = 'group-card-header';

      const number = document.createElement('span');
      number.className = 'group-number';
      number.textContent = `Group ${groupIdx + 1}`;

      const sizeTag = document.createElement('span');
      sizeTag.className = 'group-size-tag';
      sizeTag.textContent = `${group.length} student${group.length > 1 ? 's' : ''}`;

      header.appendChild(number);
      header.appendChild(sizeTag);

      const body = document.createElement('div');
      body.className = 'group-card-body';

      group.forEach(student => {
        const chip = document.createElement('div');
        chip.className = 'student-chip';

        const avatar = document.createElement('div');
        avatar.className = 'student-avatar';
        avatar.textContent = this.getInitials(student.name);

        const colorObj = this.getStudentColor(student);
        avatar.style.background = colorObj.background;
        avatar.style.color = colorObj.textColor;
        if (colorObj.border) {
          avatar.style.border = colorObj.border;
        }

        const nameSpan = document.createElement('span');
        nameSpan.textContent = student.name;

        chip.appendChild(avatar);
        chip.appendChild(nameSpan);
        body.appendChild(chip);
      });

      card.appendChild(header);
      card.appendChild(body);
      this.groupsContainer.appendChild(card);
    });
  }

  /**
   * Helper to get 1 or 2 letter initials
   */
  getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  /**
   * Copy current groups formatted as clean text
   */
  copyCurrentGroupsToClipboard() {
    if (!this.currentResult || !this.currentResult.groups || this.currentResult.groups.length === 0) {
      this.showToast('No groups to copy.');
      return;
    }

    const text = GroupingEngine.formatGroupsToText(this.currentResult.groups);
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('📋 Copied pairings to clipboard!');
    }).catch(() => {
      this.showToast('Failed to copy to clipboard.');
    });
  }

  /**
   * Toggle Projector / Fullscreen Mode
   */
  toggleProjectorMode(enable) {
    if (enable) {
      document.body.classList.add('projector-mode');
      const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      if (!isFullscreen) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(() => {});
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen().catch(() => {});
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen().catch(() => {});
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen().catch(() => {});
        }
      }
      this.showToast('Projector Mode on (Press Esc to exit)');
    } else {
      document.body.classList.remove('projector-mode');
      const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      if (isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen().catch(() => {});
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen().catch(() => {});
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen().catch(() => {});
        }
      }
    }
  }

  /**
   * Modal Management
   */
  openModal(modal) {
    modal.classList.add('open');
  }

  closeModal(modal) {
    modal.classList.remove('open');
  }

  /**
   * Render and open Interaction Matrix
   */
  openMatrixModal() {
    const active = this.students.filter(s => s.active);
    if (active.length < 2) {
      this.showToast('Need at least 2 active students to display interaction matrix.');
      return;
    }

    const pairCounts = GroupingEngine.buildInteractionMap(active, this.history);
    const { avoidPairs, preferPairs } = GroupingEngine.buildConstraintSets(this.constraints);
    this.matrixTable.innerHTML = '';

    // Header Row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const cornerTh = document.createElement('th');
    cornerTh.textContent = 'Student';
    headerRow.appendChild(cornerTh);

    active.forEach(s => {
      const th = document.createElement('th');
      th.textContent = s.name;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    this.matrixTable.appendChild(thead);

    // Body Rows
    const tbody = document.createElement('tbody');
    active.forEach(s1 => {
      const tr = document.createElement('tr');
      const rowHeader = document.createElement('th');
      rowHeader.textContent = s1.name;
      tr.appendChild(rowHeader);

      active.forEach(s2 => {
        const td = document.createElement('td');
        if (s1.id === s2.id) {
          td.className = 'matrix-cell-self';
          td.textContent = '—';
        } else {
          const key = GroupingEngine.getPairKey(s1.id, s2.id);
          const count = pairCounts.get(key) || 0;
          const isAvoid = avoidPairs.has(key);
          const isPrefer = preferPairs.has(key);

          td.textContent = count;

          let tooltip = `${s1.name} and ${s2.name}: ${count} previous meeting${count === 1 ? '' : 's'}.`;
          if (isAvoid) tooltip += ' [⛔ NEVER PAIR RULE]';
          if (isPrefer) tooltip += ' [🔗 ALWAYS PAIR RULE]';
          td.title = tooltip;

          if (isAvoid) {
            td.style.boxShadow = 'inset 0 0 0 2px var(--danger)';
          } else if (isPrefer) {
            td.style.boxShadow = 'inset 0 0 0 2px var(--primary)';
          }

          if (count === 0) {
            td.className = 'matrix-cell-0';
          } else {
            td.className = 'matrix-cell-met';
          }
        }
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    this.matrixTable.appendChild(tbody);
    this.openModal(this.modalMatrix);
  }

  /**
   * Render and open History Modal
   */
  openHistoryModal() {
    this.historyListContainer.innerHTML = '';

    if (this.history.length === 0) {
      this.historyListContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No past grouping rounds recorded for ${this.activeClass.name} yet.
        </div>
      `;
    } else {
      // Reverse chronological order
      [...this.history].reverse().forEach((round, index) => {
        const roundNum = this.history.length - index;
        const card = document.createElement('div');
        card.className = 'history-card';

        const top = document.createElement('div');
        top.className = 'history-card-top';

        const timeStr = new Date(round.timestamp).toLocaleString();
        top.innerHTML = `
          <strong>Round #${roundNum}</strong>
          <span style="color: var(--text-muted);">${timeStr}</span>
        `;

        const summary = document.createElement('div');
        summary.className = 'history-groups-summary';

        const groupsText = (round.groups || []).map((group, gIdx) => {
          const names = group.map(id => round.studentNames?.[id] || this.students.find(s => s.id === id)?.name || id).join(', ');
          return `<div><strong>Group ${gIdx + 1}:</strong> ${names}</div>`;
        }).join('');

        summary.innerHTML = groupsText;

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.justifyContent = 'flex-end';
        actions.style.gap = '0.5rem';
        actions.style.marginTop = '0.35rem';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-secondary btn-sm';
        copyBtn.textContent = 'Copy Text';
        copyBtn.addEventListener('click', () => {
          const formatted = (round.groups || []).map((group, gIdx) => {
            const names = group.map(id => round.studentNames?.[id] || id).join(', ');
            return `Group ${gIdx + 1}: ${names}`;
          }).join('\n');
          navigator.clipboard.writeText(formatted);
          this.showToast(`Copied Round #${roundNum} to clipboard!`);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Delete Round';
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Delete Round #${roundNum} from history? This will update pairing stats.`)) {
            this.history = this.history.filter(h => h.id !== round.id);
            this.persistHistory();
            this.updateStatsAndPrediction();
            this.openHistoryModal(); // Refresh modal
            this.showToast(`Deleted Round #${roundNum}`);
          }
        });

        actions.appendChild(copyBtn);
        actions.appendChild(deleteBtn);

        card.appendChild(top);
        card.appendChild(summary);
        card.appendChild(actions);

        this.historyListContainer.appendChild(card);
      });
    }

    this.openModal(this.modalHistory);
  }

  /**
   * Clear History Only for Current Class
   */
  clearHistory() {
    if (this.history.length === 0) return;
    if (confirm(`Are you sure you want to reset pairing history for "${this.activeClass.name}"? Student roster and pairing rules will be kept.`)) {
      this.history = [];
      this.persistHistory();
      this.updateStatsAndPrediction();
      this.closeModal(this.modalHistory);
      this.closeModal(this.modalSettings);
      this.showToast(`Pairing history reset for ${this.activeClass.name}`);
    }
  }

  /**
   * Factory Reset (Wipe Everything)
   */
  factoryReset() {
    if (confirm('WARNING: This will wipe all classes, student rosters, pairing rules, and history from localStorage. Continue?')) {
      StorageManager.clearAll();
      this.activeClass = StorageManager.getActiveClass();
      this.students = this.activeClass.students || [];
      this.history = this.activeClass.history || [];
      this.constraints = this.activeClass.constraints || [];
      this.selectedGroupSize = 2;
      this.sortByGender = false;
      this.renderClassHeader();
      this.renderRoster();
      this.updateGenderUI();
      this.updateStatsAndPrediction();
      this.updateConstraintsBadges();
      this.groupsContainer.innerHTML = '';
      this.resultsBar.style.display = 'none';
      this.emptyState.style.display = 'block';
      this.closeModal(this.modalSettings);
      this.showToast('All app data cleared');
    }
  }

  /**
   * Export JSON Backup
   */
  exportBackup() {
    const dataStr = StorageManager.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `partner-all-classes-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Exported full multi-class backup file');
  }

  /**
   * Import JSON Backup
   */
  importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        StorageManager.importData(content);
        this.activeClass = StorageManager.getActiveClass();
        this.students = this.activeClass.students || [];
        this.history = this.activeClass.history || [];
        this.constraints = this.activeClass.constraints || [];
        this.settings = StorageManager.getSettings();
        this.sortByGender = !!this.activeClass.sortByGender;

        // Auto-assign colors and genders to any imported students missing them
        let modified = false;
        const needsHue = this.students.some(s => typeof s.hue !== 'number');
        if (needsHue) {
          this.assignStudentColors();
          modified = true;
        }
        this.students.forEach(s => {
          if (!s.gender) {
            const detected = detectGender(s.name);
            s.gender = detected.gender;
            s.genderCategory = detected.category;
            s.genderManual = false;
            modified = true;
          }
        });
        if (modified) {
          StorageManager.saveStudents(this.students);
        }

        this.renderClassHeader();
        this.renderRoster();
        this.updateGenderUI();
        this.updateStatsAndPrediction();
        this.updateConstraintsBadges();
        this.closeModal(this.modalSettings);
        this.showToast('Backup restored successfully!');
      } catch (err) {
        alert('Failed to import backup file: Invalid format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  /**
   * Persistence helpers
   */
  persistStudents() {
    StorageManager.saveStudents(this.students);
    // Refresh constraints after auto-cleanup
    this.constraints = StorageManager.getConstraints();
  }

  persistHistory() {
    StorageManager.saveHistory(this.history);
  }

  persistConstraints() {
    StorageManager.saveConstraints(this.constraints);
  }

  /**
   * Toast notification system
   */
  showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

// Instantiate app on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.partnerApp = new PartnerApp();
});

