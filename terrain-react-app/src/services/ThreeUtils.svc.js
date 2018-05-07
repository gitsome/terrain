var PI = Math.PI;
var PI2 = PI * 2;

var ThreeUtils = {};

ThreeUtils.distance2D = function (x1, y1, x2, y2) {

    var a = x1 - x2
    var b = y1 - y2

    return Math.sqrt( a*a + b*b );
};

ThreeUtils.distance3D = function (x1, y1, z1, x2, y2, z2) {

    var a = x1 - x2;
    var b = y1 - y2;
    var c = z1 - z2;

    return Math.sqrt(a*a + b*b + c*c);
};

ThreeUtils.smallestAngle = function (angle) {
    angle = Math.abs(angle) % PI2;
    return angle > PI ? PI2 - angle : angle;
};

ThreeUtils.makeAnglePositive = function (angleInRadians) {

    while (angleInRadians < 0) {
        angleInRadians = angleInRadians + Math.PI * 2;
    }
    return angleInRadians % (Math.PI * 2);
};


ThreeUtils.getTangentPointsOnCircleFromPoint = function (cx, cy, radius, px, py) {

    let dx = px-cx;
    let dy = py-cy;
    let dd = Math.sqrt(dx * dx + dy * dy);
    let a = Math.asin(radius / dd);
    let b = Math.atan2(dy, dx);

    let t = b - a
    let ta = [radius * Math.sin(t) + cx, radius * -Math.cos(t) + cy];

    t = b + a
    let tb = [radius * -Math.sin(t) + cx, radius * Math.cos(t) + cy];

    return [ta, tb];
};


ThreeUtils.angleBetweenCirclePoints = function (x1, y1, x2, y2, radius) {
    var d = ThreeUtils.distance2D(x1,y1, x2, y2);
    return 2 * Math.asin((d/2)/radius);
};

export default ThreeUtils;