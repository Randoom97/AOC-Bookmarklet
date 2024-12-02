javascript: (function () {
    const articleElement = document.querySelector('article');

    async function getJSON() {
        const response = await fetch(window.location + '.json', {
            credentials: "same-origin"
        });
        return await response.json();
    }

    function formatTime(timeStamp) {
        return new Date(timeStamp * 1000).toLocaleString('default', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function addMemberRows(members, starDiv) {
        let rank = 1;
        for (let memberKey in members) {
            const member = members[memberKey];
            const row = document.createElement('div');
            row.style.whiteSpace = 'pre';
            row.appendChild(document.createTextNode(rank + ") "));
            const timeSpan = document.createElement('span');
            timeSpan.textContent = formatTime(member.time) + " ";
            timeSpan.style.opacity = '.5';
            row.appendChild(timeSpan);
            row.appendChild(document.createTextNode(member.name));
            rank += 1;

            starDiv.appendChild(row);
        }
    }

    function addDayDiv(dayIndex, day1, day2) {
        const dayDiv = document.createElement('div');
        Object.assign(dayDiv.style, { padding: '32px 0', display: 'flex', flexDirection: 'row', width: '100%' });
        articleElement.appendChild(dayDiv);

        const starOneDiv = document.createElement('div');
        starOneDiv.style.width = '100%';
        starOneDiv.style.padding = '0 16px';
        starOneDiv.appendChild(document.createTextNode('First star on day ' + dayIndex));

        let members = day1[dayIndex].sort((a, b) => a.time - b.time);
        addMemberRows(members, starOneDiv);

        dayDiv.appendChild(starOneDiv);

        const starTwoDiv = document.createElement('div');
        starTwoDiv.style.width = '100%';
        starTwoDiv.style.padding = '0 16px';
        starTwoDiv.appendChild(document.createTextNode('Second star on day ' + dayIndex));

        rank = 1;
        members = day2[dayIndex].sort((a, b) => a.time - b.time);
        addMemberRows(members, starTwoDiv);

        dayDiv.appendChild(starTwoDiv);
    }

    getJSON().then((json) => {
        const members = {};
        const star1 = {};
        const star2 = {};
        for (let memberKey in json.members) {
            const member = json.members[memberKey];
            members[memberKey] = member.name;
            for (let dayKey in member.completion_day_level) {
                if (!(dayKey in star1)) {
                    star1[dayKey] = []
                }
                star1[dayKey].push({ name: member.name, time: member.completion_day_level[dayKey][1].get_star_ts });
                if (!(dayKey in star2)) {
                    star2[dayKey] = []
                }
                if (member.completion_day_level[dayKey][2]) {
                    star2[dayKey].push({ name: member.name, time: member.completion_day_level[dayKey][2].get_star_ts });
                }
            }
        }

        for (let i = 1; i <= 25; i++) {
            if (i in star1) {
                addDayDiv(i, star1, star2);
            }
        }
    });
})();