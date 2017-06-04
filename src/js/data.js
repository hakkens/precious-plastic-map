export default class Data {

  constructor() {}

  getLocations() {
    // return promise which gets location data from endpoint?
    const markerData = [{
      lat: 53.3707599,
      lng: 5.889869200000021,
      name: 'BOPE',
      address: '',
      email: '',
      description: 'Lorem ipsum Elit in nisi ut ut aute nisi eiusmod ad velit elit culpa pariatur enim dolor officia consectetur officia eu sint commodo deserunt culpa minim adipisicing laborum.',
      filters: ['WORKSHOP', 'MACHINE_BUILDER', 'SHOP'],
      status: 'OPEN',
      website: 'http://www.bope.th',
      hashtags: ['Shredder', 'Injection', 'Extrusion', 'Compression']
    },
    {
      lat: 52.3707599,
      lng: 4.889869200000021,
      name: 'OTHER THING',
      address: '',
      email: '',
      description: 'Lorem ipsum Elit in nisi ut ut aute nisi eiusmod ad velit elit culpa pariatur enim dolor officia consectetur officia eu sint commodo deserunt culpa minim adipisicing laborum.',
      filters: ['BUY_PLASTIC', 'SELL_PLASTIC', 'COLLECT', 'SHOP'],
      status: 'CLOSED',
      website: 'http://www.bope.th',
      hashtags: ['Shredder', 'Injection', 'Extrusion', 'Compression']
    }

    ]

    return Promise.resolve(markerData)
  }

}
