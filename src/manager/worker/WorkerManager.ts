module aoi {
    export class WorkerDefine {
        public static ASSET_DECODE:number = 1;
    }
    export class TaskObj
    {
        public taskId:number;
        public taskData:Object;
    }
    export class WorkerManager {
        static _instance:WorkerManager;
        static get instance():WorkerManager {
            if (WorkerManager._instance == null) {
                WorkerManager._instance = new WorkerManager()
            }
            return WorkerManager._instance;
        }

        private workerDic:Object;
        private callBackDic:Object;
        private taskId:number;

        constructor() {
            this.workerDic = {};
            this.callBackDic = {};
            this.taskId = 0;
        }

        public initWorker(type:number, url:string):void {
            this.stopWorker(type);
            var worker = new Worker(url);
            this.workerDic[type] = worker;
            var s = this;
            worker.onmessage = function (event) {
                s.onWorkerEnd(event.data);
            }
        }

        public stopWorker(type:number):void {
            if (this.workerDic[type] != null) {
                this.workerDic[type].terminate();
            }
        }

        public sendToWorker(type:number, data:Object, owner:Object, callBack:Function):number {
            var worker = this.workerDic[type];
            if (worker == null) {
                return;
            }
            let t = new TaskObj();
            t.taskId = this.getTaskId();
            t.taskData = data;
            this.callBackDic[t.taskId] = {owner:owner, callBack:callBack};
            worker.postMessage(t);
            return t.taskId;
        }

        public onWorkerEnd(data):void {
            if (this.callBackDic[data.id] != null) {
                let fun:Function = this.callBackDic[data.id].callBack;
                fun.call(this.callBackDic[data.id].owner, data);
                delete this.callBackDic[data.id];
            }
        }

        public getTaskId():number {
            this.taskId++;
            return this.taskId;
        }
    }
}