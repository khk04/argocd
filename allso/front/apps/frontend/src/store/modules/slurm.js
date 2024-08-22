import axios from 'axios'

const state = {
    time: 0,
    jobs: [],
    idle: 0,
    total: 0,
    use: 0,
    persent: 0,
    runtime: [],

    cpuChart: {},
    cpuTotal: 512,
    cpuUse: 0,
    cpuPersent: 0,

    memoryChart: {},
    memorySnow: 512,
    memoryThunder: 96,
    memoryJade: 63,
    memoryTotal: 671,
    memoryUse: 0,
    memoryPersent: 0,

    nodes: [],

    cjade: 0,
    thunder: 0,
    csnow: 0,
    all: 0,
    other: 0,
    jobBarChart: {},
    jobHorizontalChart: {},
    jobHistory: [],
    endState__: null
}

const getters = {
    time() { return state.time },
    jobs() { return state.jobs },
    idle() { return state.idle },
    total() { return state.total },
    use() { return state.use },
    persent() { return state.persent },
    runtime() { return state.runtime },

    cpuChart() { return state.cpuChart },
    cpuTotal() { return state.cpuTotal },
    cpuUse() { return state.cpuUse },
    cpuPersent() { return state.cpuPersent },

    memoryChart() { return state.memoryChart },
    memorySnow() { return state.memorySnow },
    memoryThunder() { return state.memoryThunder },
    memoryJade() { return state.memoryJade },
    memoryTotal() { return state.memoryTotal },
    memoryUse() { return state.memoryUse },
    memoryPersent() { return state.memoryPersent },

    nodes() { return state.nodes },

    cjade() { return state.cjade },
    csnow() { return state.csnow },
    thunder() { return state.thunder },
    all() { return state.all },
    other() { return state.other },
    jobBarChart() { return state.jobBarChart },
    jobHorizontalChart() { return state.jobHorizontalChart },
    jobHistory() { return state.jobHistory },

    endGetters__() { return null }
}

const mutations = {
    // setTest(state, payload) { state.test = payload },
    endMutations__() {}
}

const actions = {
    // actTest({ state, commit, dispatch }, args) {
    //     console.log('CALL actTest()')
    //     return 'test'
    // },
    async getNodes({ commit }, type) {
        // try {
        // const response = await axios.get(`/slurm/nodes?type=${type}`)
        // let result = response.data

        let result = null

        switch (type) {
            case 'text':
                // state.idle = result.idle
                // state.total = result.total
                // state.use = state.total - state.idle
                // state.persent = Math.round(((state.total - state.idle) / state.total) * 100)
                break;

            case 'state':
                result = [{
                        "node": "supreme-jade01",
                        "state": "ALLOCATED"
                    },
                    {
                        "node": "supreme-snow01",
                        "state": "IDLE"
                    },
                    {
                        "node": "supreme-snow02",
                        "state": "IDLE"
                    },
                    {
                        "node": "supreme-thunder01",
                        "state": "IDLE"
                    },
                    {
                        "node": "supreme-thunder02",
                        "state": "DOWN*"
                    }
                ]
                state.idle = 0
                result.forEach(node => {
                    if (node.state === 'IDLE') {
                        state.idle = state.idle + 1
                    }
                });

                state.total = result.length
                state.use = state.total - state.idle
                state.persent = Math.round(((state.total - state.idle) / state.total) * 100)

                state.nodes = result
                break;

            case 'cpu':
                result = {
                    "cjade": 7,
                    "csnow": 41,
                    "thunder": 33,
                    "use": 0
                }
                state.cpuUse = result.use
                state.cpuPersent = Math.round((state.cpuUse / state.cpuTotal) * 100)

                state.cpuChart = {
                    labels: ['CSNOW', 'Thunder', 'CJADE', 'FREE'],
                    datasets: [{
                        label: ['CSNOW', 'Thunder', 'CJADE', 'FREE'],
                        backgroundColor: ['#00ACC1', '#039BE5', '#8000FF', '#E0E0E0'],
                        data: [result.csnow, result.thunder, result.cjade, state.cpuTotal - state.cpuUse]
                    }, ]
                }
                break;

            case 'free':
                result = {
                    "cjade": 59,
                    "csnow": 488,
                    "thunder": 92,
                    "use": 639
                }
                state.memoryUse = result.use
                state.memoryPersent = Math.round(((state.memoryTotal - result.use) / state.memoryTotal) * 100)

                state.memoryChart = {
                    labels: ['CSNOW', 'Thunder', 'CJADE', 'FREE'],
                    datasets: [{
                        label: ['CSNOW', 'Thunder', 'CJADE', 'FREE'],
                        backgroundColor: ['#00ACC1', '#039BE5', '#8000FF', '#E0E0E0', ],
                        data: [state.memorySnow - result.csnow, state.memoryThunder - result.thunder, state.memoryJade - result.cjade, result.csnow + result.thunder + result.cjade]
                    }, ]
                }
                break;

            default:
                break;
        }

        // } catch (e) {
        //     console.error(e)
        // }
    },

    async getJobs() {
        // try {
        //     const response = await axios.get('/slurm/squeue')
        //     let result = response.data
        let result = {
            "logs": []
        }
        state.jobs = result.logs
            // } catch (e) {
            //     console.error(e)
            // }
    },

    async getRuntime() {
        // try {
        //     const response = await axios.get('/slurm/runtime')
        //     let result = response.data

        let result = {
            "runtime": "2145"
        }
        state.runtime = Number(result.runtime)
            // } catch (e) {
            //     console.error(e)
            // }
    },

    async getJobHistory({}, type) {
        // try {
        //     const response = await axios.get(`/slurm/job-history?type=${type}`)
        //     let result = response.data
        let result = null

        switch (type) {
            case 'system':

                result = [{
                        "id": 2,
                        "partition": "thunder",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 3,
                        "partition": "thunder",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 4,
                        "partition": "thunder",
                        "cpu": 96,
                        "second": 24
                    },
                    {
                        "id": 5,
                        "partition": "thunder",
                        "cpu": 192,
                        "second": 38
                    },
                    {
                        "id": 6,
                        "partition": "snow",
                        "cpu": 2,
                        "second": 0
                    },
                    {
                        "id": 7,
                        "partition": "snow",
                        "cpu": 480,
                        "second": 69
                    },
                    {
                        "id": 8,
                        "partition": "snow",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 9,
                        "partition": "snow",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 10,
                        "partition": "snow",
                        "cpu": 4,
                        "second": 0
                    },
                    {
                        "id": 11,
                        "partition": "snow",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 12,
                        "partition": "snow",
                        "cpu": 2188,
                        "second": 182
                    },
                    {
                        "id": 13,
                        "partition": "snow",
                        "cpu": 160,
                        "second": 12
                    },
                    {
                        "id": 14,
                        "partition": "snow",
                        "cpu": 320,
                        "second": 23
                    },
                    {
                        "id": 15,
                        "partition": "snow",
                        "cpu": 320,
                        "second": 21
                    },
                    {
                        "id": 16,
                        "partition": "snow",
                        "cpu": 160,
                        "second": 10
                    },
                    {
                        "id": 17,
                        "partition": "snow",
                        "cpu": 160,
                        "second": 9
                    },
                    {
                        "id": 18,
                        "partition": "snow",
                        "cpu": 160,
                        "second": 9
                    },
                    {
                        "id": 19,
                        "partition": "snow",
                        "cpu": 160,
                        "second": 8
                    },
                    {
                        "id": 20,
                        "partition": "snow",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 21,
                        "partition": "snow",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 22,
                        "partition": "snow",
                        "cpu": 41280,
                        "second": 1876
                    },
                    {
                        "id": 23,
                        "partition": "thunder",
                        "cpu": 384,
                        "second": 17
                    },
                    {
                        "id": 24,
                        "partition": "thunder",
                        "cpu": 34176,
                        "second": 1424
                    },
                    {
                        "id": 25,
                        "partition": "snow",
                        "cpu": 39520,
                        "second": 1581
                    },
                    {
                        "id": 26,
                        "partition": "thunder",
                        "cpu": 35136,
                        "second": 1351
                    },
                    {
                        "id": 27,
                        "partition": "snow",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 28,
                        "partition": "snow",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 29,
                        "partition": "snow",
                        "cpu": 4320,
                        "second": 149
                    },
                    {
                        "id": 30,
                        "partition": "snow",
                        "cpu": 39360,
                        "second": 1312
                    },
                    {
                        "id": 31,
                        "partition": "thunder",
                        "cpu": 100608,
                        "second": 3245
                    },
                    {
                        "id": 32,
                        "partition": "snow",
                        "cpu": 39680,
                        "second": 1240
                    },
                    {
                        "id": 33,
                        "partition": "snow",
                        "cpu": 160,
                        "second": 5
                    },
                    {
                        "id": 34,
                        "partition": "snow",
                        "cpu": 160,
                        "second": 5
                    },
                    {
                        "id": 35,
                        "partition": "snow",
                        "cpu": 12320,
                        "second": 352
                    },
                    {
                        "id": 36,
                        "partition": "snow",
                        "cpu": 28960,
                        "second": 804
                    },
                    {
                        "id": 37,
                        "partition": "snow",
                        "cpu": 6720,
                        "second": 182
                    },
                    {
                        "id": 38,
                        "partition": "snow",
                        "cpu": 40320,
                        "second": 1061
                    },
                    {
                        "id": 39,
                        "partition": "thunder",
                        "cpu": 34176,
                        "second": 876
                    },
                    {
                        "id": 40,
                        "partition": "snow",
                        "cpu": 40480,
                        "second": 1012
                    },
                    {
                        "id": 41,
                        "partition": "snow",
                        "cpu": 24480,
                        "second": 597
                    },
                    {
                        "id": 42,
                        "partition": "snow",
                        "cpu": 40320,
                        "second": 960
                    },
                    {
                        "id": 43,
                        "partition": "snow",
                        "cpu": 42560,
                        "second": 990
                    },
                    {
                        "id": 44,
                        "partition": "snow",
                        "cpu": 39360,
                        "second": 895
                    },
                    {
                        "id": 45,
                        "partition": "thunder",
                        "cpu": 33024,
                        "second": 734
                    },
                    {
                        "id": 46,
                        "partition": "snow",
                        "cpu": 39040,
                        "second": 849
                    },
                    {
                        "id": 47,
                        "partition": "snow",
                        "cpu": 41280,
                        "second": 878
                    },
                    {
                        "id": 48,
                        "partition": "thunder",
                        "cpu": 33792,
                        "second": 704
                    },
                    {
                        "id": 50,
                        "partition": "snow",
                        "cpu": 39360,
                        "second": 787
                    },
                    {
                        "id": 51,
                        "partition": "snow",
                        "cpu": 40960,
                        "second": 803
                    },
                    {
                        "id": 52,
                        "partition": "thunder",
                        "cpu": 34944,
                        "second": 672
                    },
                    {
                        "id": 53,
                        "partition": "snow",
                        "cpu": 41120,
                        "second": 776
                    },
                    {
                        "id": 54,
                        "partition": "thunder",
                        "cpu": 34752,
                        "second": 644
                    },
                    {
                        "id": 55,
                        "partition": "snow",
                        "cpu": 40640,
                        "second": 739
                    },
                    {
                        "id": 56,
                        "partition": "thunder",
                        "cpu": 34368,
                        "second": 614
                    },
                    {
                        "id": 57,
                        "partition": "snow",
                        "cpu": 39200,
                        "second": 688
                    },
                    {
                        "id": 58,
                        "partition": "thunder",
                        "cpu": 33984,
                        "second": 586
                    },
                    {
                        "id": 59,
                        "partition": "snow",
                        "cpu": 41120,
                        "second": 697
                    },
                    {
                        "id": 60,
                        "partition": "thunder",
                        "cpu": 31872,
                        "second": 531
                    },
                    {
                        "id": 61,
                        "partition": "snow",
                        "cpu": 40320,
                        "second": 661
                    },
                    {
                        "id": 62,
                        "partition": "snow",
                        "cpu": 19520,
                        "second": 315
                    },
                    {
                        "id": 63,
                        "partition": "snow",
                        "cpu": 39200,
                        "second": 622
                    },
                    {
                        "id": 64,
                        "partition": "snow",
                        "cpu": 39520,
                        "second": 618
                    },
                    {
                        "id": 65,
                        "partition": "snow",
                        "cpu": 40320,
                        "second": 620
                    },
                    {
                        "id": 66,
                        "partition": "snow",
                        "cpu": 38400,
                        "second": 582
                    },
                    {
                        "id": 67,
                        "partition": "snow",
                        "cpu": 39680,
                        "second": 592
                    },
                    {
                        "id": 68,
                        "partition": "snow",
                        "cpu": 38560,
                        "second": 567
                    },
                    {
                        "id": 69,
                        "partition": "snow",
                        "cpu": 40000,
                        "second": 580
                    },
                    {
                        "id": 70,
                        "partition": "thunder",
                        "cpu": 34752,
                        "second": 496
                    },
                    {
                        "id": 71,
                        "partition": "snow",
                        "cpu": 40480,
                        "second": 570
                    },
                    {
                        "id": 72,
                        "partition": "thunder",
                        "cpu": 33792,
                        "second": 469
                    },
                    {
                        "id": 73,
                        "partition": "snow",
                        "cpu": 40000,
                        "second": 548
                    },
                    {
                        "id": 74,
                        "partition": "thunder",
                        "cpu": 34560,
                        "second": 467
                    },
                    {
                        "id": 75,
                        "partition": "snow",
                        "cpu": 40000,
                        "second": 533
                    },
                    {
                        "id": 76,
                        "partition": "thunder",
                        "cpu": 33984,
                        "second": 447
                    },
                    {
                        "id": 77,
                        "partition": "snow",
                        "cpu": 39840,
                        "second": 517
                    },
                    {
                        "id": 78,
                        "partition": "thunder",
                        "cpu": 34560,
                        "second": 443
                    },
                    {
                        "id": 79,
                        "partition": "snow",
                        "cpu": 40320,
                        "second": 510
                    },
                    {
                        "id": 80,
                        "partition": "thunder",
                        "cpu": 34368,
                        "second": 430
                    },
                    {
                        "id": 81,
                        "partition": "snow",
                        "cpu": 40640,
                        "second": 502
                    },
                    {
                        "id": 82,
                        "partition": "thunder",
                        "cpu": 34176,
                        "second": 417
                    },
                    {
                        "id": 83,
                        "partition": "snow",
                        "cpu": 41280,
                        "second": 497
                    },
                    {
                        "id": 84,
                        "partition": "thunder",
                        "cpu": 34176,
                        "second": 407
                    },
                    {
                        "id": 85,
                        "partition": "snow",
                        "cpu": 41600,
                        "second": 489
                    },
                    {
                        "id": 86,
                        "partition": "thunder",
                        "cpu": 34752,
                        "second": 404
                    },
                    {
                        "id": 87,
                        "partition": "snow",
                        "cpu": 40320,
                        "second": 463
                    },
                    {
                        "id": 88,
                        "partition": "thunder",
                        "cpu": 34560,
                        "second": 393
                    },
                    {
                        "id": 89,
                        "partition": "thunder",
                        "cpu": 32640,
                        "second": 367
                    },
                    {
                        "id": 90,
                        "partition": "snow",
                        "cpu": 40800,
                        "second": 453
                    },
                    {
                        "id": 91,
                        "partition": "snow",
                        "cpu": 160,
                        "second": 2
                    },
                    {
                        "id": 92,
                        "partition": "snow",
                        "cpu": 2022080,
                        "second": 21979
                    },
                    {
                        "id": 93,
                        "partition": "thunder",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 94,
                        "partition": "thunder",
                        "cpu": 2541696,
                        "second": 27039
                    },
                    {
                        "id": 95,
                        "partition": "snow",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 96,
                        "partition": "jade",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 97,
                        "partition": "jade",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 98,
                        "partition": "snow",
                        "cpu": 2016000,
                        "second": 20571
                    },
                    {
                        "id": 99,
                        "partition": "thunder",
                        "cpu": 2546496,
                        "second": 25722
                    },
                    {
                        "id": 100,
                        "partition": "snow",
                        "cpu": 2014560,
                        "second": 20146
                    },
                    {
                        "id": 101,
                        "partition": "jade",
                        "cpu": 160,
                        "second": 2
                    },
                    {
                        "id": 102,
                        "partition": "jade",
                        "cpu": 4640,
                        "second": 45
                    },
                    {
                        "id": 103,
                        "partition": "jade",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 104,
                        "partition": "jade",
                        "cpu": 4800,
                        "second": 46
                    },
                    {
                        "id": 105,
                        "partition": "jade",
                        "cpu": 4800,
                        "second": 46
                    },
                    {
                        "id": 106,
                        "partition": "jade",
                        "cpu": 4480,
                        "second": 42
                    },
                    {
                        "id": 107,
                        "partition": "jade",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 108,
                        "partition": "jade",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 109,
                        "partition": "jade",
                        "cpu": 105600,
                        "second": 969
                    },
                    {
                        "id": 110,
                        "partition": "jade",
                        "cpu": 15520,
                        "second": 141
                    },
                    {
                        "id": 111,
                        "partition": "jade",
                        "cpu": 203680,
                        "second": 1835
                    },
                    {
                        "id": 112,
                        "partition": "jade",
                        "cpu": 43520,
                        "second": 389
                    },
                    {
                        "id": 113,
                        "partition": "jade",
                        "cpu": 42720,
                        "second": 378
                    },
                    {
                        "id": 114,
                        "partition": "jade",
                        "cpu": 621440,
                        "second": 5451
                    },
                    {
                        "id": 115,
                        "partition": "snow",
                        "cpu": 1861120,
                        "second": 16184
                    },
                    {
                        "id": 116,
                        "partition": "thunder",
                        "cpu": 2566656,
                        "second": 22126
                    },
                    {
                        "id": 117,
                        "partition": "jade",
                        "cpu": 617600,
                        "second": 5279
                    },
                    {
                        "id": 118,
                        "partition": "jade",
                        "cpu": 29440,
                        "second": 249
                    },
                    {
                        "id": 119,
                        "partition": "jade",
                        "cpu": 23040,
                        "second": 194
                    },
                    {
                        "id": 120,
                        "partition": "jade",
                        "cpu": 28320,
                        "second": 236
                    },
                    {
                        "id": 121,
                        "partition": "jade",
                        "cpu": 1,
                        "second": 0
                    },
                    {
                        "id": 122,
                        "partition": "snow",
                        "cpu": 517120,
                        "second": 4239
                    },
                    {
                        "id": 123,
                        "partition": "snow",
                        "cpu": 0,
                        "second": 0
                    },
                    {
                        "id": 124,
                        "partition": "snow",
                        "cpu": 92640,
                        "second": 747
                    },
                    {
                        "id": 125,
                        "partition": "snow",
                        "cpu": 61600,
                        "second": 493
                    },
                    {
                        "id": 126,
                        "partition": "snow",
                        "cpu": 62240,
                        "second": 494
                    },
                    {
                        "id": 127,
                        "partition": "snow",
                        "cpu": 60640,
                        "second": 477
                    },
                    {
                        "id": 128,
                        "partition": "thunder",
                        "cpu": 2545344,
                        "second": 19886
                    },
                    {
                        "id": 129,
                        "partition": "snow",
                        "cpu": 61120,
                        "second": 474
                    },
                    {
                        "id": 130,
                        "partition": "snow",
                        "cpu": 61120,
                        "second": 470
                    },
                    {
                        "id": 131,
                        "partition": "snow",
                        "cpu": 61760,
                        "second": 471
                    },
                    {
                        "id": 132,
                        "partition": "jade",
                        "cpu": 616160,
                        "second": 4668
                    },
                    {
                        "id": 133,
                        "partition": "snow",
                        "cpu": 62080,
                        "second": 467
                    }
                ]
                result.sort((prev, current) => { return current.second - prev.second })

                let topResult = result.filter((order, index) => { return index < 18 })
                let barLabel = topResult.map(result => { return result.id })
                let barData = topResult.map(result => { return result.second })
                state.jobHistory = result.length

                let cjade = result.filter(result => { return result.partition === "cjade" })
                let thunder = result.filter(result => { return result.partition === "thunder" })
                let csnow = result.filter(result => { return result.partition === "snow" })
                let all = result.filter(result => { return result.partition === "all" })

                state.jobBarChart = {
                    labels: barLabel,
                    datasets: [{
                        label: 'SECOND',
                        backgroundColor: '#00897B',
                        data: barData
                    }, ]
                }

                state.cjade = cjade.length
                state.csnow = csnow.length
                state.thunder = thunder.length
                state.all = all.length
                state.other = result.length - (state.csnow + state.thunder + state.all)

                state.jobHorizontalChart = {
                    labels: [''],
                    datasets: [{
                            label: 'CSNOW',
                            backgroundColor: '#00897B',
                            data: [state.csnow]
                        },
                        {
                            label: 'Thunder',
                            backgroundColor: '#039BE5',
                            data: [state.thunder]
                        },

                        {
                            label: 'CJADE',
                            backgroundColor: '#8000FF',
                            data: [state.cjade]
                        },
                        {
                            label: 'Other',
                            backgroundColor: '#E0E0E0',
                            data: [state.other]
                        },
                    ],
                }
                break;

            default:
                break;
        }

        // } catch (e) {
        //     console.error(e)
        // }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}