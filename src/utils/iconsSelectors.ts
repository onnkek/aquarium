import brokenCloudsIcon from '../assets/icons/weather/broken-clouds.svg'
import clearSkyIcon from '../assets/icons/weather/clear-sky.svg'
import fewCloudsIcon from '../assets/icons/weather/few-clouds.svg'
import mistIcon from '../assets/icons/weather/mist.svg'
import rainIcon from '../assets/icons/weather/rain.svg'
import scatteredCloudsIcon from '../assets/icons/weather/scattered-clouds.svg'
import showerRainIcon from '../assets/icons/weather/shower-rain.svg'
import snowIcon from '../assets/icons/weather/snow.svg'
import thunderstormIcon from '../assets/icons/weather/thunderstorm.svg'
import lpIcon from '../assets/icons/lp.svg'
import testIcon from '../assets/icons/test.svg'
import icon1 from '../assets/icons/icon1.svg'
import icon2 from '../assets/icons/icon2.svg'
import icon3 from '../assets/icons/icon3.svg'
import icon4 from '../assets/icons/icon4.svg'
import icon5 from '../assets/icons/icon5.svg'
import icon6 from '../assets/icons/icon6.svg'
import icon7 from '../assets/icons/icon7.svg'
import icon8 from '../assets/icons/icon8.svg'
import icon9 from '../assets/icons/icon9.svg'
import icon10 from '../assets/icons/icon10.svg'
import coffee from '../assets/icons/coffee.svg'
import folderIcon from '../assets/icons/folder.svg'

export const getWeatherIcon = (iconName: string): string | undefined => {
  switch (iconName) {
    case "01n":
    case "01d":
      return clearSkyIcon
    case "02n":
    case "02d":
      return fewCloudsIcon
    case "03n":
    case "03d":
      return scatteredCloudsIcon
    case "04n":
    case "04d":
      return brokenCloudsIcon
    case "09n":
    case "09d":
      return showerRainIcon
    case "10n":
    case "10d":
      return rainIcon
    case "11n":
    case "11d":
      return thunderstormIcon
    case "13n":
    case "13d":
      return snowIcon
    case "50n":
    case "50d":
      return mistIcon
    default:
      return clearSkyIcon
  }

}

export const getNotesIcon = (name: string) => {
  switch (name) {
    case "lp":
      return lpIcon
    case "test":
      return testIcon
    case "icon1":
      return icon1
    case "icon2":
      return icon2
    case "icon3":
      return icon3
    case "icon4":
      return icon4
    case "icon5":
      return icon5
    case "icon6":
      return icon6
    case "icon7":
      return icon7
    case "icon8":
      return icon8
    case "icon9":
      return icon9
    case "icon10":
      return icon10
    case "coffee":
      return coffee
    default:
      return folderIcon
  }
}