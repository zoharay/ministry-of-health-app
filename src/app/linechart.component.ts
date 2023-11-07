import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { ApiService } from './api.service';

@Component({
  selector: 'line-chart',
  template: `<canvas id="canvas">{{chart}}</canvas>`,
   styles: [`
  `],
})
export class LinechartComponent {
  isSidenavOpen = true;

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
  title = '';
  chart: any = [];
  result: any;
  labledata:any=[];
  maindata:any=[];

  constructor(private service: ApiService) {}

  ngOnInit(labledata:any,maindata:any ) {
    this.service.get().subscribe((res) => {
      this.result = res;
      let measureFullArray = this.result.filter((x: { measure: string ,year:number}) => x.measure === 'הנקה מלאה' && x.year!=null);

      let groupedData = measureFullArray.reduce((result:any, item:any) => {
        let year = item.year;
        if (!result[year]) {
          result[year] = { year: year, ageOneMonthCount: 0,ageTreeMonthCount: 0,ageSixMonthCount: 0,ageTwelveMonthCount: 0,
             totalCount: 0 ,ageOneMonthPercent:0,ageTreeMonthPercent:0,ageSixMonthPercent:0,ageTwelveMonthPercent:0};
        }
        switch(item.age) {
          case 1:
            result[year].ageOneMonthCount += item.count;
            break;
          case 3:
            result[year].ageTreeMonthCount += item.count;
            break;
          case 6:
            result[year].ageSixMonthCount += item.count;
            break;
          case 12:
            result[year].ageTwelveMonthCount += item.count;
            break;
        }
    
        result[year].totalCount += item.count;
        result[year].ageOneMonthPercent = (result[year].ageOneMonthCount/result[year].totalCount)*100;
        result[year].ageTreeMonthPercent = (result[year].ageTreeMonthCount/result[year].totalCount)*100;
        result[year].ageSixMonthPercent = (result[year].ageSixMonthCount/result[year].totalCount)*100;
        result[year].ageTwelveMonthPercent = (result[year].ageTwelveMonthCount/result[year].totalCount)*100;
        return result;
      }, {});
      
      
let data = Object.keys(groupedData).map((key) => {
  return {
    year: groupedData[key].year,
    ageOneMonthPercent: groupedData[key].ageOneMonthPercent,
    ageTreeMonthPercent: groupedData[key].ageTreeMonthPercent,
    ageSixMonthPercent: groupedData[key].ageSixMonthPercent,
    ageTwelveMonthPercent: groupedData[key].ageTwelveMonthPercent
  }
});

this.labledata=data.map(item => item.year);
      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: this.labledata,
          datasets: [
            {
              label: 'גיל חודש',
              data: (data.map((item:{ageOneMonthPercent:number}) => item.ageOneMonthPercent)),
              borderWidth: 1,
              borderColor: 'orange',
              backgroundColor: 'orange'
            },
            {
              label: 'גיל 3 חודשים',
              data: (data.map((item:{ageTreeMonthPercent:number}) => item.ageTreeMonthPercent)),
              borderWidth: 1,
              borderColor: 'red',
              backgroundColor: 'red'
            },
            {
              label: 'גיל 6 חודשים',
              data: (data.map((item:{ageSixMonthPercent:number}) => item.ageSixMonthPercent)),
              borderWidth: 1,
              borderColor: 'blue',
              backgroundColor: 'blue'
            },
            {
              label: 'גיל 12 חודשים',
              data: (data.map((item:{ageTwelveMonthPercent:number}) => item.ageTwelveMonthPercent)),
              borderWidth: 1,
              borderColor: 'green',
              backgroundColor: 'green'
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'תינוקות יונקים מגמה שנתית לפי גיל'
            }
          },
          scales: {
            y: {
              suggestedMin: 0,
              suggestedMax: 75,
              ticks: {
                stepSize: 15,
                callback: function(value, index, ticks) {
                    return  value+ '%' ;
                }
            }
            }
        }
        },
      });
    });
  }
}