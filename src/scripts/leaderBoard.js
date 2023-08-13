export class LeaderBoard {
    static STORAGE_KEY = 'pixel-jump.leader-board';

    static isNewRecord(points) {
        if (points <= 0) {
            return false;
        }
        const all = LeaderBoard.getAll();
        return all.length < 10 || all.some((x) => points > x.points);
    }

    static getAll() {
        const stored = localStorage.getItem(LeaderBoard.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static add(points, name) {
        const date = new Date().toISOString();
        let updated = LeaderBoard.getAll();
        updated.push({
            points,
            name,
            date,
        });
        updated = updated.sort((a, b) => b.points - a.points).slice(0, 10);
        localStorage.setItem(LeaderBoard.STORAGE_KEY, JSON.stringify(updated));
    }

    static getHtml() {
        const html = [];
        LeaderBoard.getAll().forEach((x, i) => {
            html.push('<div class="modal-leader-board-row">');
            html.push(`<div>#${i+1} ${x.name}</div>`);
            html.push(`<div>${x.points.toLocaleString()}</div>`);
            html.push('</div>');
        });
        return html.join('');
    }
}
