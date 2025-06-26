import { Routes } from '@angular/router';

import { CoursesComponent } from './courses/courses.component';
import { SemestersComponent } from './semesters/semesters.component';
import { SubjectsComponent } from './subjects/subjects'; // ou .component.ts, confirme!
import { CurriculumComponent } from './curriculum/curriculum.component';
import { ClassComponent } from './classGroup/class.component';
import { StudentDashboardComponent } from './classStudents/dashboard.component';
import { TeacherDashboardComponent } from './classTeachers/dashboard.component';

import { hasAnyRole } from '../../core/user.guard';

export const routes: Routes = [
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [hasAnyRole(['admin', 'coordenador'])],
  },
  {
    path: 'semesters',
    component: SemestersComponent,
    canActivate: [hasAnyRole(['admin', 'coordenador'])],
  },
  {
    path: 'subjects',
    component: SubjectsComponent,
    canActivate: [hasAnyRole(['admin', 'coordenador'])],
  },
  {
    path: 'curriculum',
    component: CurriculumComponent,
    canActivate: [hasAnyRole(['admin', 'coordenador'])],
  },
  {
    path: 'classes',
    component: ClassComponent,
    canActivate: [hasAnyRole(['admin', 'coordenador'])],
  },
  {
    path: 'dashboard-students',
    component: StudentDashboardComponent,
    canActivate: [hasAnyRole(['aluno'])],
  },
  {
    path: 'dashboard-teachers',
    component: TeacherDashboardComponent,
    canActivate: [hasAnyRole(['professor'])],
  },
  {
    path: '',
    redirectTo: 'error',
    pathMatch: 'full',
  },
];
