module aoi {
    import Vector3D = math.Vector3D;
    export class RaycastPicker implements IPicker {
        private _hasCollisions:boolean;
        private _numEntities:number;
        private _entities:Array<IMouseObj>;
        private _meshDataCheck:boolean = false;

        constructor() {
            this._entities = [];
        }

        public set meshDataCheck(value:boolean) {
            this._meshDataCheck = value;
        }

        public get meshDataCheck():boolean {
            return this._meshDataCheck;
        }

        public getViewCollision(x:number, y:number, view:View, renderList:RenderList):IMouseObj {
            var rayPosition = view.unproject(x, y, 0);
            var rayDirection = view.unproject(x, y, 1);
            rayDirection.x = rayDirection.x - rayPosition.x;
            rayDirection.y = rayDirection.y - rayPosition.y;
            rayDirection.z = rayDirection.z - rayPosition.z;
            var localRayPosition, localRayDirection, rayEntryDistance, pickingCollisionVO;
            var vec = renderList.mouseVec;
            var len = vec.length, cur_target, i = 0;
            this._numEntities = 0;
            this._hasCollisions = false;
            for (i = 0; i < len; i++) {
                cur_target = vec[i];
                if (cur_target == null || cur_target.visible == false
                    || cur_target.mouseEnable == false) {
                    continue;
                }
                pickingCollisionVO = cur_target.pickingCollisionVO;
                var invSceneTransform = cur_target.inverseSceneTransform;
                localRayPosition = invSceneTransform.transformVector(rayPosition);
                localRayDirection = invSceneTransform.deltaTransformVector(rayDirection);
                var bounds = cur_target.bound;
                if (pickingCollisionVO.localNormal == null) {
                    pickingCollisionVO.localNormal = new Vector3D();
                }
                rayEntryDistance = bounds.rayIntersection(localRayPosition, localRayDirection, pickingCollisionVO.localNormal);

                if (rayEntryDistance >= 0) {
                    this._hasCollisions = true;

                    pickingCollisionVO.rayEntryDistance = rayEntryDistance;
                    pickingCollisionVO.localRayPosition = localRayPosition;
                    pickingCollisionVO.localRayDirection = localRayDirection;
                    pickingCollisionVO.rayOriginIsInsideBounds = rayEntryDistance == 0;

                    this._entities[this._numEntities++] = cur_target;
                }
            }
            if (this._hasCollisions == false) {
                return null;
            }
            this._entities.length = this._numEntities;
            this._entities = this._entities.sort(this.sortOnNearT);
            if (this.meshDataCheck == false) {
                return this._entities[0];
            }
            var shortestCollisionDistance = Number.MAX_VALUE, bestCollisionVO;
            for (i = 0; i < this._numEntities; i++) {
                cur_target = this._entities[i];
                if (cur_target.canCheckMesh == false) {
                    return cur_target;
                }
                pickingCollisionVO = cur_target.pickingCollisionVO;
                if (pickingCollisionVO != null) {
                    if ((bestCollisionVO == null || pickingCollisionVO.rayEntryDistance < bestCollisionVO.rayEntryDistance)
                        && cur_target.collidesBefore(shortestCollisionDistance, false)) {
                        shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;
                        bestCollisionVO = pickingCollisionVO;
                        this.updateLocalPosition(pickingCollisionVO);
                        return pickingCollisionVO.target;
                    }
                }
                else if (bestCollisionVO == null || pickingCollisionVO.rayEntryDistance < bestCollisionVO.rayEntryDistance) {
                    this.updateLocalPosition(pickingCollisionVO);
                    if (bestCollisionVO == null) {
                        return null;
                    }
                    return bestCollisionVO.target;
                }
            }
            if (bestCollisionVO == null) {
                return null;
            }
            return bestCollisionVO.target;
        }

        private sortOnNearT(entity1, entity2):number {
            return entity1.pickingCollisionVO.rayEntryDistance > entity2.pickingCollisionVO.rayEntryDistance ? 1 : -1;
        }

        private updateLocalPosition(pickingCollisionVO):void {
            if (pickingCollisionVO.localPosition == null) {
                pickingCollisionVO.localPosition = new Vector3D();
            }
            var collisionPos = pickingCollisionVO.localPosition;
            var rayDir = pickingCollisionVO.localRayDirection;
            var rayPos = pickingCollisionVO.localRayPosition;
            var t = pickingCollisionVO.rayEntryDistance;
            collisionPos.x = rayPos.x + t * rayDir.x;
            collisionPos.y = rayPos.y + t * rayDir.y;
            collisionPos.z = rayPos.z + t * rayDir.z;
        }
    }
}