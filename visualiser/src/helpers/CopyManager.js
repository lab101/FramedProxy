


class CopyManager {

    constructor() {
    //    this.StingerCopy = [];
    //    this.UseCases = [];
    //    this.ResultCopy = [];
       this.copyObject = {};
    }

    //singleton
    static getInstance() {
        if (!CopyManager.instance) {
            CopyManager.instance = new CopyManager();
        }
        return CopyManager.instance;
    }

   

    loadData(serverUrl, callback) {
        fetch(serverUrl)
            .then(response => response.text())
            .then(data => {
                // Process the XML data here
                //this.parseXml(data);
                this.copyObject = JSON.parse(data).copy;
                if (callback) callback();
            })
            .catch(error => {
                console.error('Error:', error);
                if (callback) callback();
            });
    }
}

 

export { CopyManager };
