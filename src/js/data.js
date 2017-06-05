export default class Data {

  getLocations() {
    const dummyMarkerData = [{
        lat: 53.3707599,
        lng: 5.889869200000021,
        name: 'BOPE',
        address: 'Dam 1, 1012 JS Amsterdam, Netherlands',
        email: 'thing@gmail.com',
        description: 'Lorem ipsum Elit in nisi ut ut aute nisi eiusmod ad velit elit culpa pariatur enim dolor officia consectetur officia eu sint commodo deserunt culpa minim adipisicing laborum.',
        filters: ['MACHINE_BUILDER', 'SHOP'],
        status: 'OPEN',
        website: 'http://www.bope.th',
        hashtags: ['Shredder', 'Injection', 'Extrusion', 'Compression']
      },
      {
        lat: 52.3707599,
        lng: 4.889869200000021,
        name: 'OTHER THING',
        address: 'Stationsplein 10, 1012 AB Amsterdam, Netherlands',
        email: 'stuff@gmail.com',
        description: 'Lorem ipsum Elit in nisi ut ut aute nisi eiusmod ad velit elit culpa pariatur enim dolor officia consectetur officia eu sint commodo deserunt culpa minim adipisicing laborum.',
        filters: ['BUY_PLASTIC', 'SELL_PLASTIC', 'COLLECT', 'SHOP'],
        status: 'CLOSED',
        website: 'http://www.bope.th',
        hashtags: ['Shredder', 'Injection', 'Extrusion', 'Compression']
      }
    ]
    return Promise.resolve(dummyMarkerData)
  }
}
