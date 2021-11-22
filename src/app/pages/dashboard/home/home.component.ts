/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Home } from 'src/app/interfaces/home';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  form: FormGroup;

  public lineChartData: ChartDataSets[] = [
    {
      data: [130, 90, 280, 230, 20, 40, 80, 130, 190, 60, 250, 300],
      label: 'Gastos Mensais',
    },
  ];
  public lineChartLabels: Label[] = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  public lineChartOptions: ChartOptions & { annotation?: any } = {
    responsive: true,
    title: {
      display: true,
      text: 'Gastos Mensais por Ano',
      fontColor: 'white', // chart title color (can be hexadecimal too)
      fontSize: 25,
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          ticks: {
            fontColor: 'white', // x axe labels (can be hexadecimal too)
            fontSize: 20,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            fontColor: 'white', // y axes numbers color (can be hexadecimal too)
            min: 0,
            beginAtZero: true,
            fontSize: 20,
          },
          scaleLabel: {
            display: true,
            labelString: 'Valor',
            fontColor: 'white', // y axe label color (can be hexadecimal too)
            fontSize: 20,
          },
        },
      ],
    },
    legend: {
      display: true,
      labels: {
        fontColor: 'white', // legend color (can be hexadecimal too)
        fontSize: 20,
      },
    },
    plugins: {
      datalabels: {
        color: '#FFF',
      },
    },
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'white',
      backgroundColor: 'rgba(255,0,0,0.5)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Gastos Por Categoria',
      fontColor: 'white',
      fontSize: 25, // chart title color (can be hexadecimal too)
    },
    legend: {
      display: true,
      labels: {
        fontSize: 25,
        fontColor: 'white', // legend color (can be hexadecimal too)
      },
    },
    plugins: {
      datalabels: {
        color: '#FFF',
      },
    },
  };

  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(255,0,0,0.3)',
        'rgba(0,255,0,0.3)',
        'rgba(0,0,255,0.3)',
      ],
    },
  ];

  user: IUser;
  oHome: Home;
  refresh: BehaviorSubject<boolean>;
  subscriptions$: Array<Subscription>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private authService: AuthService,
  ) {
    this.oHome = this.route.snapshot.data.home;
    console.log(JSON.stringify(this.route.snapshot.data));
    this.form = this.formBuilder.group({
      bill_id: [''],
      title: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      value: [''],
      status: ['waiting'],
      bill_category_id: [''],
    });

    this.refresh = new BehaviorSubject<boolean>(false);
    this.subscriptions$ = new Array<Subscription>();

    this.user = {} as IUser;
  }
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.homeService.getHome().subscribe((home: Home) => {
      this.oHome = home;

      this.lineChartData[0].data = Object.keys(
        this.oHome.data.spent_month,
      ).map(key => Number(this.oHome.data.spent_month[key]));

      Object.keys(this.oHome.data.category).forEach(key => {
        this.pieChartData.push(Number(this.oHome.data.category[key]));
        this.pieChartLabels.push(key);
      });
    });

    this.subscriptions$.push(
      this.authService.userObservable.subscribe((res: any) => {
        if (res) {
          this.user = res.user;
        }
      }),
    );
  }
}
