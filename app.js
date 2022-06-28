// import data from "../assets/player-stats.json"
async function getData () {
    try {
        const response = await fetch(`/assets/player-stats.json`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('%c Error fetching players data:  ', 'background: #222; color: #bada55', error.message);
        return undefined;
    }
}

const playersData = await getData()

const select = document.getElementById('playersDropdown');
select.addEventListener('change', selectPlayer);

if (playersData) {
    playersData.players.forEach(item => {
        const option = document.createElement('option');
        option.innerText = `${item.player.name.first} ${item.player.name.last}`;
        option.value = item.player.id;
        select.appendChild(option);
    })
}

function selectPlayer (event) {
    event.preventDefault();
    const select = event.target;
    const id = select.value;
    const fullName = select.options[select.selectedIndex].text;
    const selectedPlayerData = playersData.players.filter(item => item.player.id === +id)[0];
    if (selectedPlayerData) {
        //Get necessary player info
        const { player, stats } = selectedPlayerData;
        const teamId = player.currentTeam.id;
        // console.log('This is the team id :', teamId)
        const playerPossition = player.info.positionInfo.split(' ').pop();
        const appearances = extractStats("appearances", stats);
        const totalGoals = extractStats("goals", stats);
        const assists = extractStats("goal_assist", stats);
        const minutesPlayed = extractStats("mins_played", stats);
        const totalPasses = extractStats("fwd_pass", stats) + extractStats("backward_pass", stats);
        const goalsPerMatch = (totalGoals / appearances).toFixed(2);
        const passesPerMinute = (totalPasses / minutesPlayed).toFixed(2)
        const teamBadgeURL = `/assets/images/team${teamId}.png`
        //Set player info to relevant fields
        document.getElementById('playerImage').src = `/assets/images/p${id}.png`;
        document.getElementsByClassName('player-name')[0].innerText = fullName;
        document.getElementsByClassName('player-position')[0].innerText = playerPossition;
        document.getElementsByClassName('team-logo')[0].style.backgroundImage = `url(${teamBadgeURL})`
        setStatValue("appereances", appearances);
        setStatValue("goals", totalGoals);
        setStatValue("assists", assists);
        setStatValue("goalsPerMatch", goalsPerMatch);
        setStatValue("passesPerMinute", passesPerMinute);

    }
    // console.log('First and last name: ', selectedPlayerData);

}

//Helper functions

function extractStats (statName, statsArray) {
    const neededStat = statsArray.filter(stat => stat.name === statName)[0];
    return neededStat ? neededStat.value : 0;
}

function setStatValue (statId, value) {
    document.querySelector(`#${statId} > .stat-value`).innerText = value;
}



