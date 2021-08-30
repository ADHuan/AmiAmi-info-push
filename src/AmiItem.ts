function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class AmiItem {
  url: string;
  apiurl: string;
  id: string;
  canbuy: boolean = false;
  gcode!: string;
  gname!: string;
  onGet: Function = () => {};

  constructor(url: string, id?: string,onGet?: Function) {
    this.url = url;
    const tstr = url.split('?')[1].split('&')[0];
    //this.apiurl = 'https://26967c2f-5684-4199-a2aa-77ae16470537.mock.pstmn.io/api/v1.0/item?' + tstr + '&lang=cn';
    this.apiurl = 'https://api.amiami.com/api/v1.0/item?' + tstr + '&lang=cn';
    if (typeof id == 'undefined') {
      this.id = uuid();
    } else {
      this.id = id;
    }
    this.iniinfo(this.apiurl);
  }

  async iniinfo(url: string) {
    const req = await fetch(url, {
      headers: {
        'x-user-key': 'amiami_dev',
      },
    });

    const ansjson = await req.json();
    console.log(ansjson);

    this.gcode = ansjson.item.gcode;
    this.gname = ansjson.item.gname;
    if (ansjson.item.cart_type != '4') {
      this.canbuy = true;
    }
    console.log(this);
    setTimeout(() => {
      this.onGet();
    }, 50);
  }

  refresh() {
    this.iniinfo(this.apiurl);
  }

  getinfo() {
    return {
      url: this.url,
      id: this.id,
      canbuy: this.canbuy,
      gcode: this.gcode,
      gname: this.gname,
    };
  }
}

export default AmiItem;
