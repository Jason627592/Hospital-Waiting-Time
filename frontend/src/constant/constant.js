
import React from 'react'

const googleMapsApiKey = "AIzaSyD6lojkLvRg7LpwZWqGvueixgbomxNBARo"

const hospitalPhoto = [
  "https://lh5.googleusercontent.com/p/AF1QipO8mP_GWJKw9l_CN9G8OwX4t4Ia9pm-XKSZWUxI=w408-h306-k-no",
  "https://www.givegift.com.hk/upload_files/2019671512496028_20170403_20170403-231553.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/c3/HK_CheungChauHospital.JPG",
  "https://www3.ha.org.hk/qmh/redevelopment/images/multipleSlide/04.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/HK_KwongWahHospital2.JPG/1024px-HK_KwongWahHospital2.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Queen_Elizabeth_Hospital.jpg/1024px-Queen_Elizabeth_Hospital.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/TKO_Hospital.jpg/1024px-TKO_Hospital.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/United_Christian_Hospital.jpg/1200px-United_Christian_Hospital.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/ea/Caritas_Medical_Centre.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/North_Lantau_Hospital.jpg/1024px-North_Lantau_Hospital.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/89/PrincessMargaretHospital%282%29.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/4/4a/HK_YanChaiHospital_BlkB.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Nethersole_TaiPoNewHospital.jpg/1024px-Nethersole_TaiPoNewHospital.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Northern_District_Hospital.jpg/1024px-Northern_District_Hospital.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/HK_Prince_of_Wales_Hospital.jpg/1024px-HK_Prince_of_Wales_Hospital.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Pok_Oi_Hospital.jpg/1024px-Pok_Oi_Hospital.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Tin_Shui_Wai_Hospital.jpg/1024px-Tin_Shui_Wai_Hospital.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Tuen_Mun_Hospital.jpg/1024px-Tuen_Mun_Hospital.jpg"
]

const hospitalDataWaitTimeField = "waitTime";
const hospitalDataUpdateTimeField = "updateTime";
const hospitalDataNameField = "hospName";
const hospitalDataTopWaitField = "topWait";
const dataPerHour = 4;
const pastTenHourRequestNumber = dataPerHour * 10;
const past7DaysRequestNumber = 7;



export default{
  googleMapsApiKey,
  hospitalPhoto,
  hospitalDataWaitTimeField,
  hospitalDataUpdateTimeField,
  hospitalDataNameField,
  hospitalDataTopWaitField,
  pastTenHourRequestNumber,
  past7DaysRequestNumber
}
