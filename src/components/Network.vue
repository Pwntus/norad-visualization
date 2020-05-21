<template lang="pug">
.network(ref="graph")
</template>

<script>
import Papa from 'papaparse'
import csv from '@/assets/csv/2019.csv'

export default {
  name: 'Network',
  props: {
    year: Number
  },
  data: () => ({
    network: null,
    options: {
      layout: {
        improvedLayout: true,
        hierarchical: {
          direction: 'UD',
          sortMethod: 'directed',
          levelSeparation: 9000,
          nodeSpacing: 250
        }
      },
      nodes: {
        size: 75,
        color: 'white',
        borderWidth: 0,
        font: {
          size: 18,
          face: 'Tahoma',
          color: 'black'
        }
      },
      edges: {
        color: {
          inherit: 'from'
        },
        smooth: {
          type: 'continuous'
        }
      },
      physics: {
        enabled: false,
        stabilization: false,
        barnesHut: {
          gravitationalConstant: -80000,
          springConstant: 0.01,
          springLength: 500
        }
      },
      interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: false
      }
    }
  }),
  methods: {
    generate () {
      Papa.parse(csv, {
        delimeter: ';',
        header: true,
        worker: false,
        fastMode: true,
        // step: ({ data, errors }) => {}
        complete: ({ data }) => {
          const edges = []
          const leafNodes = data
            .filter(row => row['Agreement Number'] && row['Recipient Region'] && row['Recipient Country'] && row['Disbursements (1000 $)'])
            .map((row, i) => ({
              id: `leaf-${i}`,
              region: row['Recipient Region'],
              country: row['Recipient Country'],
              disbursements: row['Disbursements (1000 $)'] * 1000,
              label: `${row['Agreement Number']} - $${row['Disbursements (1000 $)'] * 1000}`
            }))

          const regionNodes = []
          const countryNodes = []

          for (const i in leafNodes) {
            const { region, country } = leafNodes[i]

            // Find region
            const regionNodeIndex = regionNodes.findIndex(({ id }) => id === region)
            if (regionNodeIndex < 0) {
              let sum = leafNodes
                .filter(leaf => leaf.region === region)
                .reduce((total, { disbursements }) => total + disbursements, 0)
              regionNodes.push({
                id: region,
                color: 'green',
                shape: 'hexagon',
                size: 250,
                font: {
                  size: 150,
                  color: 'green'
                },
                label: `${region} - $${sum}`,
              })

              // Add edge from root to region
              edges.push({ from: 0, to: region })
            }

            // Find country
            const countryNodeIndex = countryNodes.findIndex(({ id }) => id === country)
            if (countryNodeIndex < 0) {
              let sum = leafNodes
                .filter(leaf => leaf.country === country)
                .reduce((total, { disbursements }) => total + disbursements, 0)
              countryNodes.push({
                id: country,
                color: 'white',
                shape: 'triangleDown',
                size: 100,
                font: {
                  size: 75,
                  color: 'white'
                },
                label: `${country} - $${sum}`
              })

              // Add edge from region to country
              edges.push({ from: region, to: country })
            }

            // Add edge from region to leaf node
            edges.push({ from: country, to: `leaf-${i}` })
          }

          let sum = leafNodes
            .reduce((total, { disbursements }) => total + disbursements, 0)
          const nodes = [
            {
              id: 0,
              color: 'red',
              shape: 'star',
              size: 1000,
              font: {
                color: 'red',
                size: 200
              },
              label: `Norge - $${sum}`
            },
            ...countryNodes,
            ...regionNodes,
            ...leafNodes
          ]

          this.network = new vis.Network(this.$refs.graph, { nodes, edges }, this.options)
        },
        error: e => {
          console.log('ERROR', e)
        }
      })
    }
  },
  mounted () {
    this.generate()
  },
  beforeDestroy () {
    if (this.network)
      this.network.destroy()
  }
}
</script>

<style lang="stylus" scoped>
.network
  width 100%
  height 100%

  >>> .vis-network
    background black !important
    outline none
</style>
