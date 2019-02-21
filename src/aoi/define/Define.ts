module aoi {
    export class Define {
        public static RADIANS_TO_DEGREES:number = 180 / Math.PI;
        public static DEGREES_TO_RADIANS:number = Math.PI / 180;

        public static XY:string = "+xy";
        public static XZ:string = "+xz";
        public static YZ:string = "+yz";

        public static STAND:number = 0;

        private static CAM_DIC:Object;

        public static CAM_NORMAL:number = 1;
        public static CAM_2D:number = 2;
        public static CAM_SHADOW:number = 3;
        public static CAM_PERTURBATION:number = 4;

        public static COLLECT_TYPE_NORMAL:number = 1;
        public static COLLECT_TYPE_2D:number = 2;
        public static COLLECT_TYPE_SHADOW:number = 3;
        public static COLLECT_TYPE_PERTURBATION:number = 4;
        public static COLLECT_TYPE_BACK:number = 5;

        public static FBO_SHADOW:number = 1;
        public static FBO_PERTURBATION:number = 2;

        public static ANDROID:number = 1;
        public static IOS:number = 2;
        public static PC:number = 3;

        public static getCollectTypes(t:number):Array<number>
        {
            if(Define.CAM_DIC == null)
            {
                Define.CAM_DIC = {};
                Define.CAM_DIC[Define.CAM_NORMAL] = [Define.COLLECT_TYPE_NORMAL, Define.COLLECT_TYPE_BACK];
                Define.CAM_DIC[Define.CAM_2D] = [Define.COLLECT_TYPE_2D];
                Define.CAM_DIC[Define.CAM_SHADOW] = [Define.COLLECT_TYPE_SHADOW];
                Define.CAM_DIC[Define.CAM_PERTURBATION] = [Define.COLLECT_TYPE_PERTURBATION];
            }
            return Define.CAM_DIC[t];
        }
    }
}