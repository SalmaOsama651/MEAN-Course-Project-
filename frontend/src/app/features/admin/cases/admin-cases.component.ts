import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    inject
} from '@angular/core';

import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { forkJoin } from 'rxjs';

import { AdminCasesService } from '../../../core/services/admin-cases.service';
import { Case } from '../../../core/models/case.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
    selector: 'app-admin-cases',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmDialogComponent, SidebarComponent, ReactiveFormsModule],
    templateUrl: './admin-cases.component.html',
    styleUrl: './admin-cases.component.css',
})
export class AdminCasesComponent implements OnInit {
    private fb = inject(FormBuilder);
    private adminCasesService = inject(AdminCasesService);
    private cdr = inject(ChangeDetectorRef);


    cases: Case[] = [];

    form: FormGroup = this.createForm();

    isLoading = false;
    isSubmitting = false;
    isEditing = false;
    isDifficultyDropdownOpen = false;
    isRoleDropdownOpen = false;
    openQuestionDropdownIndex: number | null = null;
    openCorrectAnswerDropdownIndex: number | null = null;
    openRoleDropdownIndex: number | null = null;
    isFilterDifficultyDropdownOpen = false;
    isDeleteDialogOpen = false;
    caseToDelete: any = null;

    editingCaseId: string | null = null;

    errorMessage = '';
    successMessage = '';

    searchTerm = '';
    selectedDifficulty = 'All';

    toggleDifficultyDropdown(): void {
        this.isDifficultyDropdownOpen =
            !this.isDifficultyDropdownOpen;
    }


    selectDifficulty(value: string): void {
        this.form.get('difficulty')?.setValue(value);

        this.isDifficultyDropdownOpen = false;
    }
    selectQuestionType(index: number, type: string): void {
        this.questions.at(index).get('questionType')?.setValue(type);
        this.openQuestionDropdownIndex = null;
    }
    selectCorrectAnswer(index: number, answer: string): void {
        this.questions.at(index).get('correctAnswer')?.setValue(answer);
        this.openCorrectAnswerDropdownIndex = null;
    }
    selectRole(index: number, role: string): void {
        this.suspects.at(index).get('role')?.setValue(role);
        this.openRoleDropdownIndex = null;
    }

    selectFilterDifficulty(difficulty: string): void {
        this.selectedDifficulty = difficulty;
        this.isFilterDifficultyDropdownOpen = false;
    }

    get filteredCases(): Case[] {
        return this.cases.filter((caseItem: any) => {
            const search = this.searchTerm.toLowerCase();

            const matchesSearch =
                !search ||
                caseItem.title?.toLowerCase().includes(search) ||
                caseItem._id?.toLowerCase().includes(search);

            const matchesDifficulty =
                this.selectedDifficulty === 'All' ||
                caseItem.difficulty === this.selectedDifficulty;

            return matchesSearch && matchesDifficulty;
        });
    }

    getDifficultyStars(difficulty: string): number {
        switch (difficulty) {
            case 'Easy':
                return 1;

            case 'Medium':
                return 3;

            case 'Hard':
                return 5;

            default:
                return 1;
        }
    }

    // العناصر القديمة التي حذفها المستخدم أثناء التعديل
    deletedClueIds: string[] = [];
    deletedQuestionIds: string[] = [];
    deletedSuspectIds: string[] = [];

    ngOnInit(): void {
        this.loadCases();
    }

    // =========================
    // FORM
    // =========================

    createForm(): FormGroup {
        return this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            difficulty: ['Easy', Validators.required],
            storyIntro: ['', Validators.required],
            fullSolutionStory: ['', Validators.required],

            clues: this.fb.array([]),
            questions: this.fb.array([]),
            suspects: this.fb.array([]),
        });
    }

    get clues(): FormArray {
        return this.form.get('clues') as FormArray;
    }

    get questions(): FormArray {
        return this.form.get('questions') as FormArray;
    }

    get suspects(): FormArray {
        return this.form.get('suspects') as FormArray;
    }

    // =========================
    // CLUES
    // =========================

    addClue(clue?: any): void {
        this.clues.push(
            this.fb.group({
                _id: [clue?._id || null],
                order: [
                    clue?.order ?? this.clues.length + 1,
                    [Validators.required, Validators.min(1)],
                ],
                title: [clue?.title || '', Validators.required],
                content: [clue?.content || '', Validators.required],
            })
        );
    }

    removeClue(index: number): void {
        const clue = this.clues.at(index).getRawValue();

        if (clue._id) {
            this.deletedClueIds.push(clue._id);
        }

        this.clues.removeAt(index);

        // إعادة ترتيب الأدلة
        this.clues.controls.forEach((control, i) => {
            control.patchValue({ order: i + 1 });
        });
    }

    // =========================
    // QUESTIONS
    // =========================

    addQuestion(question?: any): void {
        const optionValues =
            question?.options?.length > 0
                ? question.options
                : ['', ''];

        const options = this.fb.array(
            optionValues.map((option: string) =>
                this.fb.control(option, Validators.required)
            )
        );

        this.questions.push(
            this.fb.group({
                _id: [question?._id || null],

                questionType: [
                    question?.questionType || 'who',
                    Validators.required,
                ],

                questionText: [
                    question?.questionText || '',
                    Validators.required,
                ],

                options,

                correctAnswer: [
                    question?.correctAnswer || '',
                    Validators.required,
                ],

                points: [
                    question?.points ?? 50,
                    [Validators.required, Validators.min(1)],
                ],
            })
        );
    }

    removeQuestion(index: number): void {
        const question = this.questions.at(index).getRawValue();

        if (question._id) {
            this.deletedQuestionIds.push(question._id);
        }

        this.questions.removeAt(index);
    }

    getOptions(questionIndex: number): FormArray {
        return this.questions
            .at(questionIndex)
            .get('options') as FormArray;
    }

    addOption(questionIndex: number): void {
        this.getOptions(questionIndex).push(
            this.fb.control('', Validators.required)
        );
    }

    removeOption(
        questionIndex: number,
        optionIndex: number
    ): void {
        const options = this.getOptions(questionIndex);

        // لازم على الأقل اختيارين
        if (options.length <= 2) {
            return;
        }

        options.removeAt(optionIndex);
    }

    // =========================
    // SUSPECTS
    // =========================

    addSuspect(suspect?: any): void {
        this.suspects.push(
            this.fb.group({
                _id: [suspect?._id || null],

                name: [
                    suspect?.name || '',
                    Validators.required,
                ],

                role: [
                    suspect?.role || 'suspect',
                    Validators.required,
                ],

                statement: [
                    suspect?.statement || '',
                    Validators.required,
                ],

                avatar: [
                    suspect?.avatar || '',
                ],
            })
        );
    }

    removeSuspect(index: number): void {
        const suspect = this.suspects.at(index).getRawValue();

        if (suspect._id) {
            this.deletedSuspectIds.push(suspect._id);
        }

        this.suspects.removeAt(index);
    }

    // =========================
    // LOAD CASES
    // =========================

    loadCases(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.adminCasesService.getCases().subscribe({
            next: (response: any) => {
                console.log('CASES RESPONSE:', response);

                this.cases = [...(response.data || [])];

                this.isLoading = false;

                console.log('CASES ARRAY:', this.cases);
                console.log('CASES LENGTH:', this.cases.length);

                this.cdr.detectChanges();
            },

            error: (error) => {
                console.error(error);

                this.errorMessage =
                    error.error?.message ||
                    'Failed to load cases';

                this.isLoading = false;

                this.cdr.detectChanges();
            },
        });
    }
    // =========================
    // CREATE MODE
    // =========================

    createNewCase(): void {
        this.resetForm();

        this.addClue();
        this.addQuestion();
        this.addSuspect();
    }

    // =========================
    // EDIT
    // =========================

    editCase(selectedCase: Case): void {
        if (!selectedCase._id) return;

        this.resetForm();

        this.isEditing = true;
        this.editingCaseId = selectedCase._id;
        this.isLoading = true;

        this.adminCasesService
            .getCaseDetails(selectedCase._id)
            .subscribe({
                next: (response) => {
                    const data = response.data;
                    const caseData = data.caseDetails;

                    // Basic data
                    this.form.patchValue({
                        title: caseData.title,
                        description: caseData.description,
                        difficulty: caseData.difficulty,
                        storyIntro: caseData.storyIntro,
                        fullSolutionStory:
                            caseData.fullSolutionStory,
                    });

                    // Clues
                    data.clues.forEach((clue) => {
                        this.addClue(clue);
                    });

                    // Questions
                    data.questions.forEach((question) => {
                        this.addQuestion(question);
                    });

                    // Suspects
                    data.suspects.forEach((suspect) => {
                        this.addSuspect(suspect);
                    });

                    this.isLoading = false;
                },

                error: (error) => {
                    console.error(error);

                    this.errorMessage =
                        error.error?.message ||
                        'Failed to load case details';

                    this.isLoading = false;
                },
            });
    }

    // =========================
    // SUBMIT
    // =========================

    onSubmit(): void {
        this.errorMessage = '';
        this.successMessage = '';

        if (this.form.invalid) {
            this.form.markAllAsTouched();

            this.errorMessage =
                'Please fill in all required fields.';

            return;
        }

        this.isSubmitting = true;

        if (this.isEditing) {
            this.updateExistingCase();
        } else {
            this.createCase();
        }
    }

    // =========================
    // CREATE CASE
    // =========================

    createCase(): void {
        const payload = this.cleanCreatePayload(
            this.form.getRawValue()
        );

        this.adminCasesService
            .createCase(payload)
            .subscribe({
                next: () => {
                    this.successMessage =
                        'Case created successfully!';

                    this.isSubmitting = false;

                    this.loadCases();
                    this.resetForm();
                },

                error: (error) => {
                    console.error(error);

                    this.errorMessage =
                        error.error?.message ||
                        'Failed to create case.';

                    this.isSubmitting = false;
                },
            });
    }

    // =========================
    // UPDATE CASE
    // =========================

    updateExistingCase(): void {
        if (!this.editingCaseId) return;

        const rawData = this.form.getRawValue();

        const caseData = {
            title: rawData.title,
            description: rawData.description,
            difficulty: rawData.difficulty,
            storyIntro: rawData.storyIntro,
            fullSolutionStory:
                rawData.fullSolutionStory,
        };

        this.adminCasesService
            .updateCase(
                this.editingCaseId,
                caseData
            )
            .subscribe({
                next: () => {
                    this.syncRelatedData(rawData);
                },

                error: (error) => {
                    console.error(error);

                    this.errorMessage =
                        error.error?.message ||
                        'Failed to update case.';

                    this.isSubmitting = false;
                },
            });
    }

    // =========================
    // SYNC CLUES / QUESTIONS / SUSPECTS
    // =========================

    syncRelatedData(rawData: any): void {
        const caseId = this.editingCaseId!;
        const requests: any[] = [];

        // -------- DELETE OLD CLUES --------
        this.deletedClueIds.forEach((id) => {
            requests.push(
                this.adminCasesService.deleteClue(id)
            );
        });

        // -------- CREATE / UPDATE CLUES --------
        rawData.clues.forEach((clue: any) => {
            const clueData = {
                caseId,
                order: clue.order,
                title: clue.title,
                content: clue.content,
            };

            if (clue._id) {
                requests.push(
                    this.adminCasesService.updateClue(
                        clue._id,
                        clueData
                    )
                );
            } else {
                requests.push(
                    this.adminCasesService.createClue(
                        clueData
                    )
                );
            }
        });

        // -------- DELETE OLD QUESTIONS --------
        this.deletedQuestionIds.forEach((id) => {
            requests.push(
                this.adminCasesService.deleteQuestion(id)
            );
        });

        // -------- CREATE / UPDATE QUESTIONS --------
        rawData.questions.forEach((question: any) => {
            const questionData = {
                caseId,
                questionType:
                    question.questionType,
                questionText:
                    question.questionText,
                options:
                    question.options,
                correctAnswer:
                    question.correctAnswer,
                points:
                    question.points,
            };

            if (question._id) {
                requests.push(
                    this.adminCasesService.updateQuestion(
                        question._id,
                        questionData
                    )
                );
            } else {
                requests.push(
                    this.adminCasesService.createQuestion(
                        questionData
                    )
                );
            }
        });

        // -------- DELETE OLD SUSPECTS --------
        this.deletedSuspectIds.forEach((id) => {
            requests.push(
                this.adminCasesService.deleteSuspect(id)
            );
        });

        // -------- CREATE / UPDATE SUSPECTS --------
        rawData.suspects.forEach((suspect: any) => {
            const suspectData = {
                caseId,
                name: suspect.name,
                role: suspect.role,
                statement: suspect.statement,
                avatar: suspect.avatar,
            };

            if (suspect._id) {
                requests.push(
                    this.adminCasesService.updateSuspect(
                        suspect._id,
                        suspectData
                    )
                );
            } else {
                requests.push(
                    this.adminCasesService.createSuspect(
                        suspectData
                    )
                );
            }
        });

        // تنفيذ كل requests
        if (requests.length === 0) {
            this.finishUpdate();
            return;
        }

        forkJoin(requests).subscribe({
            next: () => {
                this.finishUpdate();
            },

            error: (error) => {
                console.error(error);

                this.errorMessage =
                    error.error?.message ||
                    'Some related data could not be updated.';

                this.isSubmitting = false;
            },
        });
    }

    finishUpdate(): void {
        this.successMessage =
            'Case updated successfully!';

        this.isSubmitting = false;

        this.loadCases();

        this.deletedClueIds = [];
        this.deletedQuestionIds = [];
        this.deletedSuspectIds = [];
    }

    // =========================
    // DELETE CASE
    // =========================

    deleteCase(selectedCase: Case): void {
        if (!selectedCase._id) return;

        this.caseToDelete = selectedCase;
        this.isDeleteDialogOpen = true;
    }

    confirmDelete(): void {
        if (!this.caseToDelete?._id) return;

        const caseId = this.caseToDelete._id;

        this.adminCasesService
            .deleteCase(caseId)
            .subscribe({
                next: () => {
                    this.successMessage =
                        'Case deleted successfully!';

                    this.loadCases();

                    // لو القضية المفتوحة هي نفسها
                    if (this.editingCaseId === caseId) {
                        this.resetForm();
                    }

                    this.isDeleteDialogOpen = false;
                    this.caseToDelete = null;
                },

                error: (error) => {
                    console.error(error);

                    this.errorMessage =
                        error.error?.message ||
                        'Failed to delete case.';

                    this.isDeleteDialogOpen = false;
                    this.caseToDelete = null;
                },
            });
    }


    cancelDelete(): void {
        this.isDeleteDialogOpen = false;
        this.caseToDelete = null;
    }
    // =========================
    // RESET
    // =========================

    resetForm(): void {
        this.form = this.createForm();

        this.isEditing = false;
        this.editingCaseId = null;

        this.deletedClueIds = [];
        this.deletedQuestionIds = [];
        this.deletedSuspectIds = [];

        this.errorMessage = '';
    }

    cancelEdit(): void {
        this.resetForm();
    }

    // =========================
    // CLEAN CREATE PAYLOAD
    // =========================

    cleanCreatePayload(data: any): any {
        return {
            title: data.title,
            description: data.description,
            difficulty: data.difficulty,
            storyIntro: data.storyIntro,
            fullSolutionStory:
                data.fullSolutionStory,

            clues: data.clues.map(
                ({ _id, ...clue }: any) => clue
            ),

            questions: data.questions.map(
                ({ _id, ...question }: any) => question
            ),

            suspects: data.suspects.map(
                ({ _id, ...suspect }: any) => suspect
            ),
        };
    }
}