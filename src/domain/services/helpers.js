
class Helper {
  constructor (array, isReverse, operation, stringToFind) {
    this.array = array
    this.isReverse = isReverse
    this.operation = operation
    this.stringToFind = stringToFind
  }

  checkAvailability (appointments, newAppointment) {
    if (appointments.length > 0) {
      const [haveAvailability] = appointments.map(x => {
        if (x.date === newAppointment.date) {
          return !(JSON.stringify(x.slot) === JSON.stringify(newAppointment.slot))
        }
      }).filter(availability => availability != null)

      if (haveAvailability === (null || undefined)) {
        return true
      }

      return haveAvailability
    } else {
      // first register
      return true
    }
  }

  searchByRange () {
    let newArray = []
    let foundElement = false

    if (this.isReverse) {
      this.array = this.array.reverse()
    }
    this.array.forEach(x => {
      if (this.selectStringMethod(x) && !foundElement) {
        foundElement = true
      }
      if (foundElement) {
        newArray.push(x)
      }
    })

    if (this.isReverse) {
      newArray = newArray.reverse()
    }
    return newArray
  }

  selectStringMethod (string) {
    switch (this.operation) {
      case 1:
        return string.startsWith(this.stringToFind)
      case 2:
        return string.endsWith(this.stringToFind)
    }
  }

  remove (array, element) {
    return array.filter(el => el !== element)
  }

  getCurrentDay (dayNumber) {
    if (!dayNumber) {
      dayNumber = new Date().getDay()
    }

    switch (dayNumber) {
      case 1:
        return 'monday'
      case 2:
        return 'tuesday'
      case 3:
        return 'wednesday'
      case 4:
        return 'thursday'
      case 5:
        return 'friday'
    }
  }

  getRange (start, end, interval) {
    function getMinutes (time) {
      var a = time.split(':').map(Number)
      return a[0] * 60 + a[1]
    }

    function getTime (m) {
      var h = m / 60 | 0
      m %= 60
      if (h < 10) { h = '0' + h }
      return h + ':' + (m < 10 ? '0' + m : m)
    }

    var r = []
    var startM = getMinutes(start)
    var endM = getMinutes(end)

    while (startM + interval <= endM) {
      r.push(getTime(startM) + ' - ' + getTime(startM + interval))
      startM += interval
    }
    return r
  }

  setDaysRange (arrayDays) {
    let availability = 0

    for (var key in arrayDays) {
      if (arrayDays[key][0] && arrayDays[key][1]) {
        availability += 1
      } else {
        continue
      }

      arrayDays[key] = this.getRange(arrayDays[key][0], arrayDays[key][1], 30)
    }
    return { days: arrayDays, availability }
  }
}

module.exports = Helper
