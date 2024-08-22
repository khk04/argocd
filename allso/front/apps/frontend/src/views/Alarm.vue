<template>
  <v-card height="830" flat class="pa-4" dark color="grey darken-3">
    <v-card-text>
      <v-container style="max-width: 1500px;">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  No
                </th>
                <th class="text-left">
                  
                </th>
                <th class="text-left">
                  Occurrence time
                </th>
                <th class="text-left">
                  Alarm
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in alarms"
                :key="item.count"
              >
                <td>{{ item.count }}</td>
                <td><v-icon :color="alarmColor(item.status)"> {{alarmIcon(item.status)}} </v-icon></td>
                <!-- <td><v-icon color="red">mdi-alert-circle</v-icon></td> -->
                <td>{{ item.date }}</td>
                <td>{{ item.alarm }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>

  export default {
    name: 'Alarm',
    data () {
      return {
        alarms: [
          {count: 4, icon: 'mdi-alert-circle',  status: 'warning', date: '2020-01-01 00:00:00', alarm: '네트워크 사용률이 90%를 초과했습니다.'},
          {count: 3, icon: 'mdi-alert', status: 'caution', date: '2020-01-01 00:00:00', alarm: '메모리 사용률이 90%를 초과했습니다.'},
          {count: 2, icon: 'mdi-alert-decagram', status: 'danger', date: '2020-01-01 00:00:00', alarm: 'CPU 사용률이 90%를 초과했습니다.'},
          {count: 1, icon: 'mdi-brightness-1', status: 'active', date: '2020-01-01 00:00:00', alarm: '시스템이 시작되었습니다.'},
        ],
      }
    },
    methods: {
      alarmColor (status) {
        if (status === 'active') return 'green'
        else if (status === 'danger') return 'red'
        else if (status === 'caution') return 'yellow'
        else if (status === 'warning') return 'orange'
      },
      alarmIcon (status) {
        if (status === 'active') return 'mdi-brightness-1'
        else if (status === 'danger') return 'mdi-alert-decagram'
        else if (status === 'caution') return 'mdi-alert'
        else if (status === 'warning') return 'mdi-alert-circle'
      },

    },

    components: {
    },
  }
</script>

<style>
@media (min-width: 1264px) {
  .container {
    max-width: 1900px;
  }
}
</style>
