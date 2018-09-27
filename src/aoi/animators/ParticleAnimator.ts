 module aoi {
    export class ParticleAnimator extends AnimatorGather
    {
        public reverse:boolean;
        public reverseTime:number;
        public beginTime:number;
        public lifeTime:number;

        constructor()
        {
            super();
            this.reverse = false;
            this.reverseTime = 999999;

            this.beginTime = 1;
            this.lifeTime = 0;
        }
    }
}