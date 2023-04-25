export class Collider {
    static intersects(r1, r2) {
        return (
            r1.x <= r2.x + r2.width &&
            r1.x + r1.width >= r2.x &&
            r1.y <= r2.y + r2.height &&
            r1.y + r1.height >= r2.y
        );
    }

    static filterIntersecting(target, others) {
        return others.filter((x) => Collider.intersects(x, target));
    }
}
