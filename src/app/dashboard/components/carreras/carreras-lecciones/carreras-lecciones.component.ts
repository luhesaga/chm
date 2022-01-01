import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { ExercisesService } from 'src/app/core/services/exercises/exercises.service';
import { ForumService } from 'src/app/core/services/forums/forum.service';
import { LessonsService } from 'src/app/core/services/lessons/lessons.service';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-carreras-lecciones',
  templateUrl: './carreras-lecciones.component.html',
  styleUrls: ['./carreras-lecciones.component.scss']
})
export class CarrerasLeccionesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'progreso', 'actions'];
  dataSource = new MatTableDataSource();

  careerId: string;
  stdId: string;
  std = false;
  totalApproved = 0;
  cont = 0;
  CareerCourses: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private careerService: CarrerasService,
    private courseService: CourseService,
    private foroService: ForumService,
    private exerciseService: ExercisesService,
    private lessonService: LessonsService,
    private router: Router,
  ) {
    this.careerId = this.activatedRoute.snapshot.params.careerId;
    this.stdId = this.activatedRoute.snapshot.params.stdId;
    const stdView = this.activatedRoute.snapshot.params.std;
    if (stdView) {
      this.std = true;
    }
  }

  ngOnInit(): void {
    this.getCareerCourses();
  }

  ngOnDestroy(): void {
      if (this.CareerCourses) {
        this.CareerCourses.unsubscribe();
      }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCareerCourses(): void {
    this.CareerCourses = this.careerService.getCareerCourses(this.careerId)
      .valueChanges()
      .subscribe(cc => {
        cc.forEach(curso => {
          if (!curso.tipo) {
            curso.totalGrade = 0;
            curso.totalLecciones = 0;
            this.getCourseData(curso);
          } else {
            this.getTestAnswers(curso);
          }
        });
        this.dataSource.data = cc;
      });
  }

  getTestAnswers(curso): void {
    this.exerciseService.getUserAnswers(this.careerId, curso.id, this.stdId)
      .valueChanges()
      .subscribe((ex: any) => {
        let mayor = 0;
        let resp = 0;
        if (ex.length > 0) {
          ex.forEach(exe => {
            if (exe.tipo !== 'tarea') {
              let total = 0;
              if (exe.respuestas) {
                if (resp === 0) {
                  resp = exe.respuestas.length;
                }
                exe.respuestas.forEach(r => {
                  if (r.valor) {
                    total += r.valor;
                  }
                });
                if (total > mayor) {
                  mayor = total;
                }
              }
              curso.valor = Math.ceil(((mayor / resp) * 100) / 100);
            } else {
              if (!exe.respuestas[0].valor) {
                curso.valor = 0;
              } else {
                curso.valor = exe.respuestas[0].valor;
              }
            }
          });
        }
      });
  }

  getCourseData(curso): void {
    const cursoDetail = this.courseService.detailCourse(curso.id)
      .valueChanges()
      .subscribe(c => {
        curso.porcentaje = c.porcentaje;
        this.getCourseLessons(curso);
        cursoDetail.unsubscribe();
      });
  }

  getCourseLessons(curso: any): void {
    const lessonsList = this.lessonService.listLessons(curso.id)
      .valueChanges()
      .subscribe((lessons: any) => {
        lessons.forEach((l, index) => {
          this.getlessonContent(l, index, curso);
        });
        lessonsList.unsubscribe();
      });
  }

  getlessonContent(lesson, index, curso): void {
    const contentList = this.lessonService.listCalificableLessons(curso.id, lesson.id)
      .valueChanges()
      .subscribe((content: any) => {
        const ejercicio = {
          ejercicio: lesson.nombre,
        };
        content.forEach((ctn) => {
          if (ctn.tipo === 'Agregar foro') {
            this.getForumResult(ctn, lesson.id, ejercicio, index, curso);
          } else {
            this.getUSerResult(ctn, ejercicio, index, curso);
          }
        });
        contentList.unsubscribe();
      });
  }

  getUSerResult(contenido, ejercicio, index, curso): void {
    const ctnId = contenido.ejercicio.id;
    const userTest = this.exerciseService.getUserAnswers(curso.id, ctnId, this.stdId)
      .valueChanges()
      .subscribe((item: any) => {
        let valor = 0;
        let mayor = 0;
        if (item.length > 0) {
          item.forEach(prueba => {
            valor = 0;
            prueba.respuestas.forEach(r => {
              valor += r.valor;
            });
            if (valor > 0) {
              valor = Math.ceil((valor / (prueba.respuestas.length * 100)) * 100);
              if (valor > mayor) {
                mayor = valor;
              }
            } else {
              valor = 0;
            }
          });
          curso.totalGrade += mayor;
        }
        contenido.valor = mayor;
        ejercicio.contenido = contenido;
        curso.totalLecciones += 1;
        this.totalApproved = this.getCareerPercentage();
        userTest.unsubscribe();
      });
  }

  getForumResult(contenido, lessonId, ejercicio, index, curso): void {
    const forumResult = this.foroService.getUserAnswers(curso.id, lessonId, contenido.id, this.stdId)
      .valueChanges()
      .subscribe((f: any) => {
        if (f.length > 0) {
          contenido.valor = f[0].valor;
        } else {
          contenido.valor = 0;
        }
        curso.totalGrade += contenido.valor;
        curso.totalLecciones += 1;
        ejercicio.contenido = contenido;
        this.totalApproved = this.getCareerPercentage();
        forumResult.unsubscribe();
      });
  }

  getTotal(a, b): number {
    let total = 0;
    if (a > 0) {
      total = Math.ceil(a / b);
    }
    return total;
  }

  lessonActivated(el: any): boolean {
    let verCurso = false;
    const index = this.dataSource.data.findIndex(
      (lesson: any) => lesson.id === el.id
    );
    if (index === 0) {
      verCurso = true;
    } else {
      const p = el.totalGrade;
      const l = el.totalLecciones;
      if (p) {
        if (this.getTotal(p, l) >= el.porcentaje) {
          verCurso = true;
        } else {
          const lesson: any = this.dataSource.data[index - 1];
          const pa = lesson.totalGrade;
          const la = lesson.totalLecciones;
          if (pa) {
            if (this.getTotal(pa, la) >= lesson.porcentaje) {
              verCurso = true;
            } else {
              verCurso = false;
            }
          } else {
            if (lesson.valor >= lesson.porcentaje) {
              verCurso = true;
            } else {
              verCurso = false;
            }

          }
        }
      } else {
        if (el.valor >= el.porcentaje) {
          verCurso = true;
        } else {
          const lesson: any = this.dataSource.data[index - 1];
          const pa = lesson.totalGrade;
          const la = lesson.totalLecciones;
          if (pa) {
            if (this.getTotal(pa, la) >= lesson.porcentaje) {
              verCurso = true;
            } else {
              verCurso = false;
            }
          } else {
            if (lesson.valor >= lesson.porcentaje) {
              verCurso = true;
            } else {
              verCurso = false;
            }

          }
        }
      }
    }

    return verCurso;
  }

  getCareerPercentage(): number {
    this.cont += 1;
    let approved = 0;
    let total = 0;

    this.dataSource.data.forEach((c: any) => {
      total += 1;
      if (!c.tipo) {
        const p = c.totalGrade;
        const l = c.totalLecciones;
        if (this.getTotal(p, l) >= c.porcentaje) {
          approved += 1;
        }
      } else {
        if (c.valor >= c.porcentaje) {
          approved += 1;
        }
      }
    });
    return approved > 0 ? Math.ceil((approved / total) * 100) : 0;
  }

  goToCourseHome(el: any): void {
    if (!el.tipo) {
      if (!this.std) {
        this.router.navigateByUrl(`cursos-carrera/index/${el.id}/${this.stdId}/${this.careerId}`);
      } else {
        this.router.navigateByUrl(`cursos-carrera/index/${el.id}/${this.stdId}/${this.careerId}/${'std'}`);
      }
    } else {
      if (!this.std) {
        this.router.navigate([`evaluacion/${el.id}/${this.stdId}/${this.careerId}`]);
      } else {
        this.router.navigate([`evaluacion/${el.id}/${this.stdId}/${this.careerId}/${'std'}`]);
      }
    }
  }

  goBack(): void {
    if (!this.std) {
      this.router.navigate([`carreras/index/${this.careerId}/${'admin'}`]);
    } else {
      this.router.navigate([`carreras/index/${this.careerId}/${'std'}`]);
    }
  }

}
