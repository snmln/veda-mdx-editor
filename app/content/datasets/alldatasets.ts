const allAvailableDatasets: DatasetWithContent[] = [
  {
    metadata: {
      id: "ct-ch4-monthgrid-v2023",
      name: "CarbonTracker-CH₄ Isotopic Methane Inverse Fluxes",
      description:
        "Global, monthly 1 degree resolution methane emission estimates from microbial, fossil and pyrogenic sources derived using inverse modeling, version 2023",
      taxonomy: [
        {
          name: "Topics",
          values: [
            { id: "Anthropogenic Emissions", name: "Anthropogenic Emissions" },
            { id: "Natural Emissions and Sinks", name: "Natural Emissions and Sinks" },
            { id: "Methane", name: "Methane" },
          ],
        },
        {
          name: "Source",
          values: [
            { id: "NASA", name: "NASA" },
            { id: "NOAA", name: "NOAA" },
          ],
        },
        {
          name: "Gas",
          values: [{ id: "CH₄", name: "CH₄" }],
        },
        {
          name: "Product Type",
          values: [
            { id: "Ground Measurements", name: "Ground Measurements" },
            { id: "Model Output", name: "Model Output" },
          ],
        },
      ],
      layers: [
        {
          id: "total-ch4",
          stacCol: "ct-ch4-monthgrid-v2023",
          name: "Total CH₄ Emission",
          type: "raster",
          description:
            "Total methane emission from microbial, fossil and pyrogenic sources.",
          zoomExtent: [0, 0],
          legend: {
            unit: { label: "g CH₄/m²/year" },
            type: "gradient",
            min: "0",
            max: "50",
            stops: [
              "#F7F4F9",
              "#E9E3F0",
              "#D9C3DF",
              "#CDA0CD",
              "#D57ABA",
              "#E34A9F",
              "#DF2179",
              "#C10E51",
              "#92003F",
              "#67001F",
            ],
          },
          compare: {
            datasetId: "ct-ch4-monthgrid-v2023",
            layerId: "total-ch4",
            mapLabel: ({ dateFns, datetime, compareDatetime }) =>
              dateFns && datetime && compareDatetime
                ? `${dateFns.format(datetime, "LLL yyyy")} VS ${dateFns.format(compareDatetime, "LLL yyyy")}`
                : "",
          },
        },
        {
          id: "microbial-ch4",
          stacCol: "ct-ch4-monthgrid-v2023",
          name: "Microbial CH₄ Emission",
          type: "raster",
          description:
            "Emission of methane from all microbial sources, such as wetlands, ruminants, agriculture and termites.",
          zoomExtent: [0, 20],
          legend: {
            unit: { label: "g CH₄/m²/year" },
            type: "gradient",
            min: "0",
            max: "30",
            stops: [
              "#F7F4F9",
              "#E9E3F0",
              "#D9C3DF",
              "#CDA0CD",
              "#D57ABA",
              "#E34A9F",
              "#DF2179",
              "#C10E51",
              "#92003F",
              "#67001F",
            ],
          },
          compare: {
            datasetId: "ct-ch4-monthgrid-v2023",
            layerId: "microbial-ch4",
            mapLabel: ({ dateFns, datetime, compareDatetime }) =>
              dateFns && datetime && compareDatetime
                ? `${dateFns.format(datetime, "LLL yyyy")} VS ${dateFns.format(compareDatetime, "LLL yyyy")}`
                : "",
          },
        },
        {
          id: "fossil-ch4",
          stacCol: "ct-ch4-monthgrid-v2023",
          name: "Fossil CH₄ Emission",
          type: "raster",
          description:
            "Emission of methane from all fossil sources, such as oil and gas activities and coal mining.",
          zoomExtent: [0, 20],
          legend: {
            unit: { label: "g CH₄/m²/year" },
            type: "gradient",
            min: "0",
            max: "50",
            stops: [
              "#F7F4F9",
              "#E9E3F0",
              "#D9C3DF",
              "#CDA0CD",
              "#D57ABA",
              "#E34A9F",
              "#DF2179",
              "#C10E51",
              "#92003F",
              "#67001F",
            ],
          },
          compare: {
            datasetId: "ct-ch4-monthgrid-v2023",
            layerId: "fossil-ch4",
            mapLabel: ({ dateFns, datetime, compareDatetime }) =>
              dateFns && datetime && compareDatetime
                ? `${dateFns.format(datetime, "LLL yyyy")} VS ${dateFns.format(compareDatetime, "LLL yyyy")}`
                : "",
          },
        },
        {
          id: "pyrogenic-ch4",
          stacCol: "ct-ch4-monthgrid-v2023",
          name: "Pyrogenic CH₄ Emission",
          type: "raster",
          description:
            "Emission of methane from all sources of biomass burning, such as wildfires and crop residue burning.",
          zoomExtent: [0, 20],
          legend: {
            unit: { label: "g CH₄/m²/year" },
            type: "gradient",
            min: "0",
            max: "8",
            stops: [
              "#F7F4F9",
              "#E9E3F0",
              "#D9C3DF",
              "#CDA0CD",
              "#D57ABA",
              "#E34A9F",
              "#DF2179",
              "#C10E51",
              "#92003F",
              "#67001F",
            ],
          },
          compare: {
            datasetId: "ct-ch4-monthgrid-v2023",
            layerId: "pyrogenic-ch4",
            mapLabel: ({ dateFns, datetime, compareDatetime }) =>
              dateFns && datetime && compareDatetime
                ? `${dateFns.format(datetime, "LLL yyyy")} VS ${dateFns.format(compareDatetime, "LLL yyyy")}`
                : "",
          },
        },
      ],
    },
    slug: "ct-ch4-monthgrid-v2023",
    content: "", // If you want to include full markdown content, you can parse it in here
  },
  {
    metadata: {
      id: "eccodarwin-co2flux-monthgrid-v5",
      name: "Air-Sea CO₂ Flux, ECCO-Darwin Model v5",
      description:
        "Global, monthly average air-sea CO₂ flux at ~1/3° resolution from 2020 to 2022",
      taxonomy: [
        {
          name: "Topics",
          values: [{ id: "Natural Emissions and Sinks", name: "Natural Emissions and Sinks" }],
        },
        {
          name: "Source",
          values: [{ id: "NASA", name: "NASA" }],
        },
        {
          name: "Gas",
          values: [{ id: "CO₂", name: "CO₂" }],
        },
        {
          name: "Product Type",
          values: [{ id: "Model Output", name: "Model Output" }],
        },
      ],
      layers: [
        {
          id: "air-sea-co2",
          stacCol: "eccodarwin-co2flux-monthgrid-v5",
          name: "Air-Sea CO₂ Flux",
          type: "raster",
          description: "Monthly mean air-sea CO₂ Flux (negative into ocean)",
          zoomExtent: [0, 20],
          legend: {
            unit: { label: "mmol m²/s" },
            type: "gradient",
            min: "-0.0007",
            max: "0.0007",
            stops: [
              "#0000FF",
              "#3399FF",
              "#66CCFF",
              "#FFFFFF",
              "#FF66CC",
              "#FF3399",
              "#FF0000",
            ],
          },
          compare: {
            datasetId: "eccodarwin-co2flux-monthgrid-v5",
            layerId: "air-sea-co2",
            mapLabel: ({ dateFns, datetime, compareDatetime }) =>
              dateFns && datetime && compareDatetime
                ? `${dateFns.format(datetime, "LLL yyyy")} VS ${dateFns.format(compareDatetime, "LLL yyyy")}`
                : "",
          },
        },
      ],
    },
    slug: "eccodarwin-co2flux-monthgrid-v5",
    content: "", // optional: parsed MDX markdown content if needed
  },
  {
  metadata: {
    id: "vulcan-ffco2-elc-res-yeargrid-v4",
    name: "Vulcan Fossil Fuel CO₂ Emissions, Version 4",
    description: "Annual (2010 - 2021), 1 km resolution estimates of carbon dioxide emissions from fossil fuels and cement production over the contiguous United States, version 4.0",
    isHidden: true,
    taxonomy: [
      {
        name: "Topics",
        values: [
          { id: "Anthropogenic Emissions", name: "Anthropogenic Emissions" }
        ]
      },
      {
        name: "Source", 
        values: [
          { id: "NAU", name: "NAU" },
          { id: "NASA", name: "NASA" },
          { id: "NOAA", name: "NOAA" },
          { id: "NSF", name: "NSF" }
        ]
      },
      {
        name: "Gas",
        values: [
          { id: "CO₂", name: "CO₂" }
        ]
      },
      {
        name: "Product Type",
        values: [
          { id: "Model Output", name: "Model Output" }
        ]
      }
    ],
    layers: [
      {
        id: "vulcan-elc-res-co2",
        stacCol: "vulcan-ffco2-elc-res-yeargrid-v4", 
        name: "Scope 2 Residential Fossil Fuel CO₂ Emissions",
        type: "raster",
        description: "Estimated total annual CO₂ emissions from fossil fuel combustion (ffCO₂) across all sectors.",
        zoomExtent: [0, 20],
        legend: {
          unit: { label: "tonne CO₂/km²/year" },
          type: "gradient",
          min: "0",
          max: "500",
          stops: [
            '#5e4fa2',
            '#388eba', 
            '#75c8a5',
            '#bfe5a0',
            '#f1f9a9',
            '#feeea2',
            '#fdbf6f',
            '#f67b4a',
            '#d8434e',
            '#9e0142'
          ]
        },
        compare: {
          datasetId: "vulcan-ffco2-yeargrid-v4", 
          layerId: "vulcan-total-co2",
          mapLabel: ({ dateFns, datetime, compareDatetime }) =>
            dateFns && datetime && compareDatetime
              ? `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`
              : ""
        },
        info: {
          source: "NASA",
          spatialExtent: "Contiguous United States", 
          temporalResolution: "Annual",
          unit: "tonne CO₂/km²/year"
        }
      }
    ]
  },
  slug: "vulcan-ffco2-elc-res-yeargrid-v4",
  content: ""
  },
  {
  metadata: {
    id: "vulcan-ffco2-yeargrid-v4",
    name: "Vulcan Fossil Fuel CO₂ Emissions",
    description: "Annual (2010 - 2021), 1 km resolution estimates of carbon dioxide emissions from fossil fuel combustion over the contiguous United States, version 4.0",
    taxonomy: [
      {
        name: "Topics",
        values: [
          { id: "Anthropogenic Emissions", name: "Anthropogenic Emissions" },
          { id: "Urban", name: "Urban" }
        ]
      },
      {
        name: "Source", 
        values: [
          { id: "NAU", name: "NAU" },
          { id: "NASA", name: "NASA" },
          { id: "NOAA", name: "NOAA" },
          { id: "NSF", name: "NSF" }
        ]
      },
      {
        name: "Gas",
        values: [
          { id: "CO₂", name: "CO₂" }
        ]
      },
      {
        name: "Product Type",
        values: [
          { id: "Hybrid Product", name: "Hybrid Product" }
        ]
      }
    ],
    layers: [
      {
        id: "vulcan-total-co2",
        stacCol: "vulcan-ffco2-yeargrid-v4",
        name: "Total Fossil Fuel CO₂ Emissions",
        type: "raster",
        description: "Estimated total annual CO₂ emissions from fossil fuel combustion (ffCO₂) across all sectors.",
        zoomExtent: [0, 20],
        legend: {
          unit: { label: "tonne CO₂/km²/year" },
          type: "gradient",
          min: "0",
          max: "1400",
          stops: [
            '#5e4fa2',
            '#388eba',
            '#75c8a5',
            '#bfe5a0',
            '#f1f9a9',
            '#feeea2',
            '#fdbf6f',
            '#f67b4a',
            '#d8434e',
            '#9e0142'
          ]
        },
        compare: {
          datasetId: "vulcan-ffco2-yeargrid-v4", 
          layerId: "vulcan-total-co2",
          mapLabel: ({ dateFns, datetime, compareDatetime }) =>
            dateFns && datetime && compareDatetime
              ? `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`
              : ""
        },
        info: {
          source: "NASA",
          spatialExtent: "Contiguous United States", 
          temporalResolution: "Annual",
          unit: "tonne CO₂/km²/year"
        }
      },
      {
        id: "vulcan-air-co2",
        stacCol: "vulcan-ffco2-yeargrid-v4",
        name: "Airport Fossil Fuel CO₂ Emissions",
        type: "raster",
        description: "Estimated total annual ffCO₂ emissions from taxi, take-off, and landing up to 3000 ft.",
        zoomExtent: [0, 20],
        legend: {
          unit: { label: "tonne CO₂/km²/year" },
          type: "gradient",
          min: "0",
          max: "1400",
          stops: [
            '#5e4fa2',
            '#388eba',
            '#75c8a5',
            '#bfe5a0',
            '#f1f9a9',
            '#feeea2',
            '#fdbf6f',
            '#f67b4a',
            '#d8434e',
            '#9e0142'
          ]
        },
        compare: {
          datasetId: "vulcan-ffco2-yeargrid-v4", 
          layerId: "vulcan-air-co2",
          mapLabel: ({ dateFns, datetime, compareDatetime }) =>
            dateFns && datetime && compareDatetime
              ? `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`
              : ""
        },
        info: {
          source: "NASA",
          spatialExtent: "Contiguous United States", 
          temporalResolution: "Annual",
          unit: "tonne CO₂/km²/year"
        }
      },
      {
        id: "vulcan-res-co2",
        stacCol: "vulcan-ffco2-yeargrid-v4",
        name: "Residential Fossil Fuel CO₂ Emissions",
        type: "raster",
        description: "Estimated total annual ffCO₂ emissions from Residential buildings.",
        zoomExtent: [0, 20],
        legend: {
          unit: { label: "tonne CO₂/km²/year" },
          type: "gradient",
          min: "0",
          max: "1400",
          stops: [
            '#5e4fa2',
            '#388eba',
            '#75c8a5',
            '#bfe5a0',
            '#f1f9a9',
            '#feeea2',
            '#fdbf6f',
            '#f67b4a',
            '#d8434e',
            '#9e0142'
          ]
        },
        compare: {
          datasetId: "vulcan-ffco2-elc-res-yeargrid-v4", 
          layerId: "vulcan-elc-res-co2",
          mapLabel: ({ dateFns, datetime, compareDatetime }) =>
            dateFns && datetime && compareDatetime
              ? `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`
              : ""
        },
        info: {
          source: "NASA",
          spatialExtent: "Contiguous United States", 
          temporalResolution: "Annual",
          unit: "tonne CO₂/km²/year"
        }
      }
      // Add other layers like vulcan-com-co2, vulcan-ind-co2, etc. if needed
    ]
  },
  slug: "vulcan-ffco2-yeargrid-v4",
  content: ""
  },
  {
    metadata: {
      id: "vulcan-ffco2-elc-res-yeargrid-v4",
      name: "Vulcan Fossil Fuel CO₂ Emissions, Version 4",
      description: "Annual (2010 - 2021), 1 km resolution estimates of carbon dioxide emissions from fossil fuels and cement production over the contiguous United States, version 4.0",
      isHidden: true,
      taxonomy: [
        {
          name: "Topics",
          values: [
            { id: "Anthropogenic Emissions", name: "Anthropogenic Emissions" }
          ]
        },
        {
          name: "Source", 
          values: [
            { id: "NAU", name: "NAU" },
            { id: "NASA", name: "NASA" },
            { id: "NOAA", name: "NOAA" },
            { id: "NSF", name: "NSF" }
          ]
        },
        {
          name: "Gas",
          values: [
            { id: "CO₂", name: "CO₂" }
          ]
        },
        {
          name: "Product Type",
          values: [
            { id: "Model Output", name: "Model Output" }
          ]
        }
      ],
      layers: [
        {
          id: "vulcan-elc-res-co2",
          stacCol: "vulcan-ffco2-elc-res-yeargrid-v4", 
          name: "Scope 2 Residential Fossil Fuel CO₂ Emissions",
          type: "raster",
          description: "Estimated total annual CO₂ emissions from fossil fuel combustion (ffCO₂) across all sectors.",
          zoomExtent: [0, 20],
          legend: {
            unit: { label: "tonne CO₂/km²/year" },
            type: "gradient",
            min: "0",
            max: "500",
            stops: [
              '#5e4fa2',
              '#388eba', 
              '#75c8a5',
              '#bfe5a0',
              '#f1f9a9',
              '#feeea2',
              '#fdbf6f',
              '#f67b4a',
              '#d8434e',
              '#9e0142'
            ]
          },
          compare: {
            datasetId: "vulcan-ffco2-yeargrid-v4", 
            layerId: "vulcan-total-co2",
            mapLabel: ({ dateFns, datetime, compareDatetime }) =>
              dateFns && datetime && compareDatetime
                ? `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`
                : ""
          },
          info: {
            source: "NASA",
            spatialExtent: "Contiguous United States", 
            temporalResolution: "Annual",
            unit: "tonne CO₂/km²/year"
          }
        }
      ]
    },
    slug: "vulcan-ffco2-elc-res-yeargrid-v4",
    content: ""
  }
];

export { allAvailableDatasets };
