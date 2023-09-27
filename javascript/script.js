const filterSet = new Set();
let jobsFilteredData = [];

const getJobsData = async function () {
    const response = await fetch("/data.json");
    const jobsData = await response.json();
    return jobsData;
}

const getKeywords = data => [data.role, data.level, ...(data.languages || []), ...(data.tools || [])];

function areAllSetValuesInArray(set, array) {
    const setLower = new Set([...set].map(str => str.toLowerCase()));
    const arrayLower = array.map(str => str.toLowerCase());

    if (setLower.size === 0)
        return false;

    return [...setLower].every(value => arrayLower.includes(value));

}

const deleteKeyword = function (s, idx) {

    filterSet.delete(s);
    filterJobs(filterSet);

}

const filterJobs = async function (filterSet) {

    const jobsData = await getJobsData();
    document.getElementById("lists-info").innerHTML = "";

    jobsFilteredData = [];

    for (const key in jobsData) {
        const data = jobsData[key];
        if (areAllSetValuesInArray(filterSet, getKeywords(data))) {
            jobsFilteredData.push(data);
        }
    }
    displayJobsList(jobsFilteredData);
}

const createCategoryColumn = function () {
    const filterWords = document.getElementById('filter-words')
    document.getElementById('filter-words').innerHTML = "";

    for (const [index, s] of filterSet.entries()) {
        const fKeyword = document.createElement('span');
        filterWords.appendChild(fKeyword);
        fKeyword.classList.add(`keyword`);
        fKeyword.id = `remove-${index}`;
        fKeyword.textContent = s;
        fKeyword.onclick = function () {
            deleteKeyword(s, index);
        };
    }
}

const displayJobsList = function (jobsFilteredData) {

    if (jobsFilteredData.length === 0)
        createCategoryColumn();

    jobsFilteredData.forEach((job) => {
        const listsInfo = document.getElementById("lists-info");
        const card = document.createElement("div");

        createCategoryColumn();

        const headInfo = document.createElement("div");
        const imageHead = document.createElement("img");
        const boxData = document.createElement("div");
        const headTitles = document.createElement("div");
        const companyName = document.createElement("span");
        const status = document.createElement("span");
        const featured = document.createElement("span");
        const positionName = document.createElement("h3");
        const details = document.createElement("div");
        const postedAt = document.createElement("span");
        const contract = document.createElement("span");
        const location = document.createElement("span");
        const keywords = document.createElement("div");
        const roleKeyword = document.createElement("span");
        const levelKeyword = document.createElement("span");


        card.classList.add("card");
        headInfo.classList.add("head-info");
        boxData.classList.add("box-data");
        headTitles.classList.add("head-titles");
        companyName.classList.add("company-name");
        status.classList.add("status");
        featured.classList.add("featured");
        positionName.classList.add("position-name");
        details.classList.add("details");
        postedAt.classList.add("posted-at");
        contract.classList.add("contract");
        location.classList.add("location");
        keywords.classList.add("keywords");
        roleKeyword.classList.add(`keyword`);
        levelKeyword.classList.add(`keyword`);


        headTitles.appendChild(companyName);
        headTitles.appendChild(status);
        headTitles.appendChild(featured);
        details.appendChild(postedAt);
        details.appendChild(contract);
        details.appendChild(location);
        boxData.appendChild(headTitles);
        boxData.appendChild(positionName);
        boxData.appendChild(details);
        headInfo.appendChild(imageHead);
        headInfo.appendChild(boxData);
        keywords.appendChild(roleKeyword);
        keywords.appendChild(levelKeyword);

        for (let i = 1; i <= job["languages"]?.length; i++) {
            const keyword = document.createElement("span");
            keywords.appendChild(keyword);
            keyword.classList.add(`keyword`);
            dataLang = job["languages"];
            if (dataLang[i - 1])
                keyword.textContent = dataLang[i - 1];
        }

        for (let i = 1; i <= job["tools"]?.length; i++) {
            const keyword = document.createElement("span");
            keywords.appendChild(keyword);
            keyword.classList.add(`keyword`);
            tools = job["tools"];
            if (tools[i - 1])
                keyword.textContent = tools[i - 1];
        }


        card.appendChild(headInfo);
        card.appendChild(keywords);
        listsInfo.appendChild(card);

        imageHead.src = job.logo;
        companyName.textContent = job.company;
        status.textContent = job.new;
        featured.textContent = job.featured;
        positionName.textContent = job.position;
        postedAt.textContent = job.postedAt;
        contract.textContent = job.contract;
        location.textContent = job.location;
        roleKeyword.textContent = job.role;
        levelKeyword.textContent = job.level;

    })


}

const clearKeywords = function () {
    filterSet.clear();
    filterJobs(filterSet);
}

const filterBtn = document.getElementById("search-btn");

filterBtn.addEventListener("click", (e) => {
    let searchText = (document.getElementById("search-text").value).toLowerCase().trim();
    if (searchText) {
        filterSet.add(searchText);
        document.getElementById("search-text").value = "";
    }
    filterJobs(filterSet)
});


displayJobsList(jobsFilteredData);