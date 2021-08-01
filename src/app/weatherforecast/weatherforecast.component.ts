import { Component, OnInit } from '@angular/core';
import { tileLayer, latLng } from 'leaflet';
import * as L from "leaflet";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-weatherforecast',
  templateUrl: './weatherforecast.component.html',
  styleUrls: ['./weatherforecast.component.css']
})
export class WeatherforecastComponent implements OnInit {  
  map:any;
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Harshit'
      }),
    ],
    zoom: 5,
  };  
  icon = {
    icon:L.icon({
      iconUrl: '/assets/marker-icon.png',
      shadowUrl: '/assets/marker-shadow.png'
  }),
    draggable:true
  };  
  marker:any;
  name=""
  feellike=""
  description=""
  temp=0
  thumb=""
  city=""
  address=""
  ldata= this.formBuilder.group({
    address: ''
  });  
  sresult:any=[]
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {  
    this.map = L.map('map',this.options)
    this.marker=L.marker(latLng(29.809049599999994, 76.4116992),this.icon)
    this.marker.on("mouseup",(pos:any)=>{this.getweather(pos.latlng)})
    this.map.addLayer(this.marker)
    this.map.on("click",(pos:any)=>{   
        this.marker.setLatLng(latLng(pos.latlng.lat,pos.latlng.lng))
    })    
    navigator.geolocation.getCurrentPosition((pos)=>{this.marker.setLatLng(latLng(pos.coords.latitude,pos.coords.longitude));this.map.setView( latLng(pos.coords.latitude,pos.coords.longitude) ) },(err)=>{this.map.setView( latLng(21.105, 436.992))})
    this.getweather({lat: 29.809049599999994, lng: 76.4116992})
  }
  getweather(latlng:any){
    fetch("https://api.openweathermap.org/data/2.5/weather?lat="+latlng.lat+"&lon="+latlng.lng+"&appid=b513eea50f6de159217f3a7cf7705ce2").then((res)=>{
      return res.json()
    }).then((res)=>{
      this.name=res["name"]
      this.feellike=res["weather"][0]["main"]
      this.description=res["weather"][0]["description"]
      this.temp=Math.round(res["main"]["feels_like"]-273)
      this.thumb="https://openweathermap.org/img/wn/"+res["weather"][0]["icon"]+"@2x.png"
    })
  }
  getweatherbycity(name:any){
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+name+"&appid=b513eea50f6de159217f3a7cf7705ce2").then((res)=>{
      return res.json()
    }).then((res)=>{
      this.name=res["name"]
      this.feellike=res["weather"][0]["main"]
      this.description=res["weather"][0]["description"]
      this.temp=Math.round(res["main"]["feels_like"]-273)
      this.thumb="https://openweathermap.org/img/wn/"+res["weather"][0]["icon"]+"@2x.png"
    })
  }  
  lsearch(){
    this.sresult=[]
    const provider = new OpenStreetMapProvider();
    const results = provider.search({ query: this.ldata.value.address }).then((res)=>{
      for(let i in res){
        this.sresult.push({"name":res[i].label,"x":res[i].y,"y":res[i].x})
      }
    })
  }
  setpin(x:any,y:any,name:string){
    this.address=name
    this.sresult=[]
    this.marker.setLatLng(latLng(x,y))
    this.getweatherbycity(name)
  }
}
