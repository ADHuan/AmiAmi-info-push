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
  state: string = 'false';
  gcode!: string;
  gname!: string;
  onGet: Function = () => {};

  constructor(url: string, id?: string, onGet?: Function) {
    this.url = url;
    const tstr = url.split('?')[1].split('&')[0];
    //this.apiurl = 'https://c86185f2-33f4-4296-a7a0-fee06475dc3b.mock.pstmn.io/api/v1.0/item?' + tstr + '&lang=cn';
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

    if (ansjson.RSuccess) {
      this.gcode = ansjson.item.gcode;
      this.gname = ansjson.item.gname;
      if (ansjson.item.cart_type == '8' || ansjson.item.cart_type == '9') {
        this.state = 'true';
      }
      console.log(this);
      setTimeout(() => {
        this.onGet();
      }, 50);
    } else {
      this.gcode = 'failed';
      this.gname = '无法获取';
      this.state = 'failed';
      setTimeout(() => {
        this.onGet();
      }, 50);
    }
  }

  refresh() {
    this.iniinfo(this.apiurl);
  }

  getinfo() {
    return {
      url: this.url,
      id: this.id,
      canbuy: this.state,
      gcode: this.gcode,
      gname: this.gname,
    };
  }
}

export default AmiItem;
