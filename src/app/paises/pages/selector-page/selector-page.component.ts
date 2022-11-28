import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';
import { switchMap, tap } from "rxjs/operators";
@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {
  public miFormulario: FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })
  public regiones: string[] = []
  public paises: PaisSmall[] = []
  public fronteras: PaisSmall[] = []
  public cargando: boolean = false
  public get hayFronteras(): boolean {
    return this.fronteras.length > 0
  }
  public get hayPaises(): boolean {
    return this.paises.length > 0
  }
  constructor(
    private formBuilder: FormBuilder,
    private paisesService: PaisesService
  ) { }
  ngOnInit(): void {
    this.regiones = this.paisesService.regiones
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(() => {
          this.cargando = true
          this.miFormulario.get('pais')?.reset('')
        }),
        switchMap(region => this.paisesService.getCountryByRegion(region))
      )
      .subscribe(paises => {
        this.cargando = false
        this.paises = paises
      })
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.cargando = true
          this.miFormulario.get('frontera')?.reset('')
        }),
        switchMap(code => this.paisesService.getCountryByCode(code)),
        switchMap(pais => this.paisesService.getCountriesByCodes(pais?.borders ?? [])),
      )
      .subscribe(paises => {
        this.cargando = false
        this.fronteras = paises
      })
  }
  guardar() {
    console.log(this.miFormulario.value)
  }
}