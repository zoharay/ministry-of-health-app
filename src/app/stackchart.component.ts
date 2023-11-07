 

import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ApiService } from './api.service';

import * as echarts from "echarts";

interface AgeGroup {
  measure: '';
  precents: [];
}

export interface data {
  measure: '';
  precents: [];
}
@Component({
  selector: 'stack-chart',
  template: `<div class="mGraph-wrapper">
  <div class="mGraph" id="mGraph_sale"></div>
</div>`,
  styles: [`
  .mGraph-wrapper{
    width: 100%;
    height: 239px;
    background: #fff;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mGraph-wrapper .mGraph{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }`]
})
export class StackchartComponent  {

  series:any[] = [];
  legends:any[] = [];
  result: any ;

  constructor(private elm:ElementRef,private service: ApiService) {}

  data = [{
    legend: "",
    datapoints: []
  }];
  ngOnInit() {
    this.service.get().subscribe((res) => {
      this.result = res;
      let filteredArray = this.result.filter((x: { year:any,measure:any}) =>  x.year==null && x.measure!='הנקה מלאה + משולבת');
  
      let ageGroups = filteredArray.reduce((groups: AgeGroup[], item:any) => {
        let group:any = groups.find((g: { measure:any}) => g.measure === item.measure);
        if (!group) {
          group = { measure: item.measure, precents: [] };
          groups.push(group);
        }
        group.precents.push(item.populationRate);
        return groups;
      }, []);
    
      console.log("aa");
      ageGroups.forEach((item:{measure:string,precents:[]} ) => {
        this.data.push({
          legend: item.measure,
          datapoints: item.precents
        });
      });

    this.data.splice(0, 1);

    let stackchart = echarts.init(this.elm.nativeElement.querySelector('#mGraph_sale'));
    this.data.forEach(x=> {

      if(x!=null)
      {
        this.series.push({
        name: x.legend,
        type:'line',
        stack:'Total Amount',
        areaStyle:{normal:{}},
        data:x.datapoints
        });

        this.legends.push(x.legend);
      }
    })

    stackchart.setOption({
      title: {
        text: '\n דוח תינוקות יונקים אחוז הנקה לפי גיל  ',
        left: 'center',
      },
      tooltip:{
        trigger:'axis',
        axisPointer:{
          type:'cross',
          label:{backgroundColor:'#6a7985'}
        }
      },
       legend:{data:this.legends},
        grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        },
      ],
      series: this.series,
    },
  
    )
  });
  }
}
