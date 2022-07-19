// VARIABLES
// const id_with_hash = window.location.hash
// if (id_with_hash.length != 0){ 
//     const item_scanned = true
//     const migrant_scanned_id = window.location.hash.slice(1,)
// }
// else {
//     const item_scanned = false
// }
const top_margin_amount = 50
const shift_amount = 250

// svg animation transition
let transitionTime = 1000;
let currentScrollPos = $("#open").scrollTop();
let lastScrollPos = $("#open").scrollTop();
let scrollDirection = "forward";

// data variables
let keys = [];
let motivationsData = [];
let motivSort = "initial";

const motivsList = ["econ", "reun", "sec", "clim", "oth"];
let incomeList = [],
    cariList = [];
let motivsSummaryData = [],
    incomeSummaryData = [],
    cariSummaryData = [];

// data sort order
const motivOrder = {
    "econ": 0,
    "reun": 1,
    "sec": 2,
    "clim": 3,
    "oth": 4
};
const motivDetailOrder = {
    "1": 0, "2": 0, "6": 0, "7": 0, "8": 0,
    "12": 1,
    "10": 2, "11": 2,
    "3": 3, "4": 3, "5": 3,
    "9": 4, "13": 4, "14": 4, "15": 4, "16": 4
};

// look up index
const motivsIndex = {};

// look up attributes
const countryText_motivations = {
    "GT": "Guatemala",
    "HND": "Honduras",
    "SLV": "El Salvador"
};
const motivAttr = {
    "econ": {label: "Economics", color: "#1540c4", responses: ['1', '2', '6', '7', '8'], 
        descr: "Responses for economic motivations to migrate included: search for a better job, salary, or working conditions; unemployment; lack of money to cover basic needs (such as health, education, housing, clothing, services); and to send remittances.", yPosSide: 1, xPosLegend: 0},
    "reun":  {label: "Reunification", color: "#eb4927", responses: ['12'], 
        descr: "Family reunification was the only response in this category.", yPosSide: 27, xPosLegend: 8},
    "sec": {label: "Security", color: "#93278f", responses: ['10', '11'], 
        descr: "Responses for security motivations to migrate included: unsafety or domestic violence.", yPosSide: 32, xPosLegend: 18},
    "clim": {label: "Climate", color: "#00a99d", responses: ['3', '4', '5'], 
        descr: "Responses for climate motivations to migrate included: direct impact from a natural hazard, deterioration of livelihoods due to natural hazards (such as floods, droughts, volcanic eruptions, hurricanes, plagues) or the loss of land due to land use changes.", yPosSide: 37, xPosLegend: 25},
    "oth":  {label: "Quality of Life", color: "#f1a650", responses: ['9', '13', '14', '15', '16'], 
        descr: "Responses for climate motivations to migrate included: education, for cultural reasons or customs, for health-related reasons (such as treatments, surgeries, medical consultations, or medicines), for tourism, other reasons not listed, and responses that did not respond or reported not knowing.", yPosSide: 41, xPosLegend: 32}
};
const motivDetailAttr = {
    "1": {label: "to search for a better job", category: "econ", color: "#1540c4"},
    "2": {label: "due to unemployment", category: "econ", color: "#1540c4"},
    "3": {label: "because of a deteriorated livelihood due to natural hazards", category: "clim", color: "#00a99d"},
    "4": {label: "due to direct impact from a natural hazard", category: "clim", color: "#00a99d"},
    "5": {label: "because of loss of land due to land use change", category: "clim", color: "#00a99d"},
    "6": {label: "due to lack of money for food", category: "econ", color: "#1540c4"},
    "7": {label: "due to lack of money for basic needs", category: "econ", color: "#1540c4"},
    "8": {label: "to send remittances", category: "econ", color: "#1540c4"},
    "9": {label: "for education", category: "oth", color: "#f1a650"},
    "10": {label: "due to domestic violence", category: "sec", color: "#93278f"},
    "11": {label: "due to unsafety", category: "sec", color: "#93278f"},
    "12": {label: "for family reunification", category: "reun", color: "#eb4927"},
    "13": {label: "for cultural reasons", category: "oth", color: "#f1a650"},
    "14": {label: "due to health needs", category: "oth", color: "#f1a650"},
    "15": {label: "for adventure or tourism", category: "oth", color: "#f1a650"},
    "16": {label: "due to other reasons", category: "oth", color: "#f1a650"},
    "99": {label: "no response", category: "oth", color: "#777"}
};
const incomeAttr = {
    1: {label: "extremely low income", range: "Less than $2.50", yPosSide: 1},
    2: {label: "low income", range: "$2.50&ndash;10.40", yPosSide: 10},
    3: {label: "mid-low income", range: "$10.40&ndash;37.40", yPosSide: 19},
    4: {label: "mid income", range: "$37.40&ndash;128.70", yPosSide: 28},
    5: {label: "mid-high income", range: "$128.70&ndash;436.50", yPosSide: 41},
    6: {label: "high income", range: "Greater than $436.50", yPosSide: 47}
};
const cariAttr = {
    1: {label: "food secure", sideLabel: "food secure", 
        descr: "Households are able to meet essential food and non-food necessities without engaging in atypical coping strategies.", yPosSide: 1},
    2: {label: "marginally food secure", sideLabel: "marginally food secure", 
        descr: "Househods have minimally adequate food consumption without engaging in irreversible coping strategies; some may be unable to afford some essential non-food related expenditures.", yPosSide: 18},
    3: {label: "moderately food insecure", sideLabel: "moderately or severely food insecure", 
        descr: "Moderately food insecure households have significant food consumption gaps or are only marginally able to meet minimum food needs with irreversible coping strategies. Severely food insecure households have extreme food consumption gaps or have extreme loss of livelihood assets that will lead to food consumption gaps or worse.", yPosSide: 35},
    4: {label: "severely food insecure"}
};

const legendSplit = {
    nx: 0,
    ny: 1,
    colorCat1: "econ",
    colorCat2: "reun",
    label: "selected multiple motivations"
}

// narrative text
const narrativesData = [
    {
        title: "Migrants Come from All Income Groups",
        description: "Our data counters prior studies that say households with more resources are more likely to be able to migrate. This survey shows that migration occurs in all income levels."
    },
    {
        title: "Providing for Basic Needs are Migrants' Main Motivation",
        description: "Households with migrants showed that their primary motivation to leave was driven by the need to provide for basic needs. Individuals experiencing food insecurity were more likely (23 percent) to make concrete plans to migrate than those who were food secure (7 percent).",
        image: "mot4.jpg"
    }
]

// D3 CHART VARIABLES
const width = 1346;
const height = 942; // may need to increase based on number of rows
const sideWidth = 0;

// animation time
const time = 1000;

// square and grid dimensions
const sqLen = 24;
const gap = 4;
const numPerRow = 56;
const numPerCol = {
    "income": {
        1: 6,
        2: 6,
        3: 6,
        4: 10,
        5: 3,
        6: 1
    },
    "cari": {
        1: 14,
        2: 13,
        3: 3
    }
}

// select svg transition
const lengthMap = 12;
const lengthGrid = 24;
const strokeWidthMap = "2px";
const strokeWidthGrid = "4px";
const svgTransition = d3.select("#transition svg");

// define svg transition map rectangles
svgTransition.select("#sq")
    .selectAll("rect")
        .data(positionMapSq)
        .enter()
        .append("rect")
            .attr("width", lengthMap)
            .attr("height", lengthMap)
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("stroke", "#322DCD")
            .attr("stroke-width", strokeWidthMap)
            .attr("fill", "#fff");

svgTransition.select("#tri-overlay")
    .selectAll("rect")
        .data(positionMapTri)
        .enter()
        .append("rect")
            .attr("width", lengthMap)
            .attr("height", lengthMap)
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("stroke", "#322DCD")
            .attr("stroke-width", strokeWidthMap)
            .attr("fill", "#fff");

const svgTransRect = svgTransition.selectAll(".cell")
    .selectAll("rect");

// update svg transition rectangles
function updateTransLayout(layout) {
    if (layout == "map") {
        dataSq = positionMapSq;
        dataTri = positionMapTri;
        length = lengthMap;
        strokeWidth = strokeWidthMap;
    }
    else if (layout == "grid") {
        dataSq = positionGridSq;
        dataTri = positionGridTri;
        length = lengthGrid;
        strokeWidth = strokeWidthGrid;
    }
    svgTransition.select("#sq")
        .selectAll("rect")
            .data(dataSq)
            // .enter()
            // .append("rect")
            .transition()
                .duration(transitionTime * 1.5)
                .attr("width", length)
                .attr("height", length)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("stroke-width", strokeWidth);

    svgTransition.select("#tri-overlay")
        .selectAll("rect")
            .data(dataTri)
            // .enter()
            // .append("rect")
            .transition()
                .duration(transitionTime * 1.5)
                .attr("width", length)
                .attr("height", length)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("stroke-width", strokeWidth);
};

// define svg
const svgM = d3.select("#frame-motivations")
    .append("svg")
        .attr("id", "viz-motivations")
        .attr("viewBox", [0, 0, width, height+(2*shift_amount)])


// define tooltip
const divMotivs = d3.select("#frame-motivations").append("div")
    .attr("id", "tt-motivs")
    .attr("class", "tooltip")
    .style("z-index", "10")
    .html("<div class='side-color' style='background: rgb(21, 64, 196);'></div><p>Motivation for Migrating</p><h3 class='text-color' style='color: rgb(21, 64, 196);'><span class='label-motiv-pct'>87</span>% <span class='label-motiv text-uppercase'>Economic</span></h3><br><span class='text-hh text-color'>of <span class='label-hh'>surveyed</span> households</span><div class='row mt-1'><div class='col-left'><p>Reason for Migrating</p><span class='label-motiv-detail text-label' style='color: rgb(21, 64, 196);'>Search for a better job, unemplpoyment, lack of money to buy food</span></div><div class='col-right'><p>Origin Country</p><span class='label-country text-label'>Guatemala</span></div></div>")
    .style("display", "none");
// const divSide = d3.select("#frame-motivations").append("div")
//     .attr("id", "tt-side")
//     .attr("class", "tooltip-side p-2")
//     .style("display", "none")
//     .style("z-index", "10")
//     .text("info");

// scale grid
const scale = d3.scaleLinear()
    .domain([0, numPerRow])
    .range([0, sqLen * numPerRow]);

// load csv data and callback function
const dataset = d3.csv("./data/motivations.csv", d3.autoType)
    .then(function(data) {
        if (!keys.length) {
            keys = data.columns;
        }

        if (!motivationsData.length) {
            motivationsData = data;
        }

        // store index values for each sort
        if (!motivsIndex.length) {
            for (let i = 0; i < data.length; i++) {
                const rspId = data[i].rsp_id2;
                motivsIndex[rspId] = {};
                motivsIndex[rspId]['initial'] = i;
            }

            // sort by motivations
            if (!motivsIndex.rsp12.motivs) {
                motivsSortData = data.sort((a, z) => {
                    const motivCatIndex1 = sortCompare(motivOrder[a.motiv_cat.split('-')[0]], motivOrder[z.motiv_cat.split('-')[0]]);
                    // if same first motivation listed compare number of categories per response
                    if (motivCatIndex1 == 0) {
                        const catRspIndex = sortCompare(a.motiv_cat.substr(-1), z.motiv_cat.substr(-1));
                        // if same number of categories per response compare 2nd motivation
                        if (catRspIndex == 0) {
                            const motivCatIndex2 = sortCompare(motivOrder[a.motiv_cat.split('-')[1]], motivOrder[z.motiv_cat.split('-')[1]]);
                            // if same 2nd motivation compare detailed response
                            if (motivCatIndex2 == 0 && (typeof(a.mig_ext_motivo == 'string' && 1 < z.mig_ext_motivo == 'string'))) {
                                return sortCompare(motivDetailOrder[a.mig_ext_motivo.toString().split(' ')[0]], motivDetailOrder[z.mig_ext_motivo.toString().split(' ')[0]]);
                            }
                            return motivCatIndex2
                        }
                        return catRspIndex;
                    }
                    return motivCatIndex1;
                });
                // add motivations index to index dictionary
                for (let i = 0; i < motivsSortData.length; i++) {
                    const rspId = motivsSortData[i].rsp_id2;
                    motivsIndex[rspId]['motivs'] = i;
                }
            }

            // sort by income per capita tier
            if (!motivsIndex.rsp12.income) {
                incomeSortData = data.sort((a, z) => {
                    if (a.income_per_capita_tier == z.income_per_capita_tier) {
                        const motivCatIndex1 = sortCompare(motivOrder[a.motiv_cat.split('-')[0]], motivOrder[z.motiv_cat.split('-')[0]]);
                        // if same first motivation listed compare number of categories per response
                        if (motivCatIndex1 == 0) {
                            const catRspIndex = sortCompare(a.motiv_cat.substr(-1), z.motiv_cat.substr(-1));
                            // if same number of categories per response compare 2nd motivation
                            if (catRspIndex == 0) {
                                const motivCatIndex2 = sortCompare(motivOrder[a.motiv_cat.split('-')[1]], motivOrder[z.motiv_cat.split('-')[1]]);
                                // if same 2nd motivation compare detailed response
                                if (motivCatIndex2 == 0 && (typeof(a.mig_ext_motivo == 'string' && 1 < z.mig_ext_motivo == 'string'))) {
                                    return sortCompare(motivDetailOrder[a.mig_ext_motivo.toString().split(' ')[0]], motivDetailOrder[z.mig_ext_motivo.toString().split(' ')[0]]);
                                }
                                return motivCatIndex2
                            }
                            return catRspIndex;
                        }
                        return motivCatIndex1;
                    }
                    return sortCompare(a.income_per_capita_tier, z.income_per_capita_tier);
                });
                // add income index to index dictionary
                for (let i = 0; i < incomeSortData.length; i++) {
                    const rspId = incomeSortData[i].rsp_id2;
                    motivsIndex[rspId]['income'] = i;
                }
            }

            // sort by cari classification
            if (!motivsIndex.rsp12.cari) {
                cariSortData = data.sort((a, z) => {
                    if (a.CARI == z.CARI) {
                        const motivCatIndex1 = sortCompare(motivOrder[a.motiv_cat.split('-')[0]], motivOrder[z.motiv_cat.split('-')[0]]);
                        // if same first motivation listed compare number of categories per response
                        if (motivCatIndex1 == 0) {
                            const catRspIndex = sortCompare(a.motiv_cat.substr(-1), z.motiv_cat.substr(-1));
                            // if same number of categories per response compare 2nd motivation
                            if (catRspIndex == 0) {
                                const motivCatIndex2 = sortCompare(motivOrder[a.motiv_cat.split('-')[1]], motivOrder[z.motiv_cat.split('-')[1]]);
                                // if same 2nd motivation compare detailed response
                                if (motivCatIndex2 == 0 && (typeof(a.mig_ext_motivo == 'string' && 1 < z.mig_ext_motivo == 'string'))) {
                                    return sortCompare(motivDetailOrder[a.mig_ext_motivo.toString().split(' ')[0]], motivDetailOrder[z.mig_ext_motivo.toString().split(' ')[0]]);
                                }
                                return motivCatIndex2
                            }
                            return catRspIndex;
                        }
                        return motivCatIndex1;
                    }
                    return sortCompare(a.CARI, z.CARI);
                });
                // add cari index to index dictionary
                for (let i = 0; i < cariSortData.length; i++) {
                    const rspId = cariSortData[i].rsp_id2;
                    motivsIndex[rspId]['cari'] = i;
                }
            }
        }

        // data for summary labels
        if (!motivsSummaryData.length) {
            for (let m = 0; m < motivsList.length; m++) {
                const motiv = motivsList[m];
                item = {};

                item.group = motiv;
                item.rsp = data.filter(d => d.motiv_cat.includes(motiv)).length;
                item.pct = roundAccurately(item.rsp / data.length, 2) * 100;

                motivsSummaryData.push(item);
            }
        }

        incomeList = data.map(d => d.income_per_capita_tier).filter((value, index, self) => self.indexOf(value) === index);

        if (!incomeSummaryData.length) {
            for (let n = 0; n < incomeList.length; n++) {
                const incomeTier = incomeList[n];
                item = {};

                item.group = incomeTier;
                item.rsp = data.filter(d => d.income_per_capita_tier == incomeTier).length;
                item.pct = roundAccurately(item.rsp / data.length, 2) * 100;

                incomeSummaryData.push(item);
            }
        }

        cariList = data.map(d => d.CARI).filter((value, index, self) => self.indexOf(value) === index);

        if (!cariSummaryData.length) {
            for (let c = 0; c < cariList.length; c++) {
                const cariClass = cariList[c];                
                item = {};

                item.group = cariClass;
                item.rsp = data.filter(d => d.CARI == cariClass).length;
                item.pct = roundAccurately(item.rsp / data.length, 2) * 100;

                cariSummaryData.push(item);
            }
        }

        data.sort((a, z) => sortCompare(a.rsp_id2 > z.rsp_id2));

        plotInitialGrid(motivationsData);
        plotLabels(motivsSummaryData, "motivs");
        plotLabels(incomeSummaryData, "income");
        plotLabels(cariSummaryData.slice(0,-1), "cari");

        // console.log(keys);
        // console.log(motivationsData);

        // here
        if (window.location.hash.length != 0){

            // change opacity of all rectangles and triangles
            svgM.selectAll("rect")
                .attr("opacity", 0.8)

            svgM.selectAll("path")
                .attr("opacity", 0.8)

            // get migrant id
            const migrant_id = window.location.hash.slice(1,)
            // console.log("HASH ID HERE:", migrant_id)

            const selected_migrant_array = motivationsData.filter(item => item.rsp_id2 == "rsp"+migrant_id)
            const selected_migrant = selected_migrant_array[0]
            // console.log("selected_migrant", selected_migrant)
            const selected_migrant_motives = selected_migrant.mig_ext_motivo.toString().split(' ');
            // console.log("motives", selected_migrant_motives)

            // flip labels if text is too long/cut off
            const flipTextMotivs = [623, 351, 4725, 1249, 1052, 477];

            // change opacity of specific rectangle or triangles
            if (svgM.select("#sq-rsp"+migrant_id).empty() == false) {

                svgM.select("#sq-rsp"+migrant_id)
                    .attr("opacity", 1)
                    // .attr("stroke", "#000").raise();
                // svgM.select(".g-sq").raise();

                const migrant_x = $("#sq-rsp"+migrant_id).attr("x")
                const migrant_y = $("#sq-rsp"+migrant_id).attr("y")
                const motivationLabel = motivAttr[motivationsData.filter(e => e.rsp_id == selected_migrant.rsp_id)[0].motiv_cat.split('-')[0]].label;

                // draw line
                svgM.append("line")
                .attr("id", "migrant-line")
                .style("stroke", "black") 
                .style('stroke-width', '2px')
                .attr("x1", (parseInt(migrant_x)+12).toString())     
                .attr("y1", migrant_y)    
                .attr("x2", (parseInt(migrant_x)+12).toString())   
                .attr("y2", 210);

                // write name of migrant
                svgM.append("text")
                .attr("id", "migrant-name-label")
                .attr("x", (d) => {
                    return flipTextMotivs.includes(selected_migrant.rsp_id) ? parseInt(migrant_x) + sqLen/2
                    : parseInt(migrant_x);
                })
                .attr("y", 190)
                .style("font-size", "2.5rem")
                .text(selected_migrant.name + ": " + motivationLabel)
                    .attr("text-anchor", (d) => {
                        return flipTextMotivs.includes(selected_migrant.rsp_id) ? "end"
                        : "start";
                    })

            }
            else if (svgM.select("#tri-tr-rsp"+migrant_id).empty() == false) {

                svgM.select("#tri-bl-rsp"+migrant_id)
                    .attr("opacity", 1)
                    // .attr("stroke", "#000")
                    // .raise()
                svgM.select("#tri-tr-rsp"+migrant_id)
                    .attr("opacity", 1)
                    // .attr("stroke", "#000")
                    // .raise()
                // svgM.select(".g-tri-bl").raise()
                // svgM.select(".g-tri-tr").raise()

                const migrant_x = $("#tri-tr-rsp"+migrant_id).attr("d").split(' ')[1]
                const migrant_y = $("#tri-tr-rsp"+migrant_id).attr("d").split(' ')[2]
                const motivationLabel1 = motivAttr[motivationsData.filter(e => e.rsp_id == selected_migrant.rsp_id)[0].motiv_cat.split('-')[0]].label;
                const motivationLabel2 = motivAttr[motivationsData.filter(e => e.rsp_id == selected_migrant.rsp_id)[0].motiv_cat.split('-')[1]].label;

                // draw line
                svgM.append("line")
                .attr("id", "migrant-line")
                .style("stroke", "black") 
                .style('stroke-width', '2px')
                .attr("x1", (parseInt(migrant_x)+12).toString())     
                .attr("y1", migrant_y)   
                .attr("x2", (parseInt(migrant_x)+12).toString())    
                .attr("y2", 210);

                // write name of migrant
                svgM.append("text")
                .attr("id", "migrant-name-label")
                .attr("x", (d) => {
                    return flipTextMotivs.includes(selected_migrant.rsp_id) ? parseInt(migrant_x) + sqLen/2
                    : parseInt(migrant_x);
                })
                .attr("y", 190)
                .style("font-size", "2.5rem")
                .text(selected_migrant.name + ": " + motivationLabel1 + " & " + motivationLabel2)
                    .attr("text-anchor", (d) => {
                        return flipTextMotivs.includes(selected_migrant.rsp_id) ? "end"
                        : "start";
                    })

            }
            else if (svgM.select("#tri-t-rsp"+migrant_id).empty() == false) {

                svgM.select("#tri-t-rsp"+migrant_id).attr("opacity", 1)
                svgM.select("#tri-r-rsp"+migrant_id).attr("opacity", 1)
                svgM.select("#tri-bl-rsp"+migrant_id).attr("opacity", 1)

                const migrant_x = $("#tri-tr-rsp"+migrant_id).attr("d").split(' ')[1]
                const migrant_y = $("#tri-tr-rsp"+migrant_id).attr("d").split(' ')[2]
                console.log("x and y", migrant_x, migrant_y)
                // draw line
                svgM.append("line")
                .attr("id", "migrant-line")
                .style("stroke", "black") 
                .style('stroke-width', '2px')
                .attr("x1", (parseInt(migrant_x)+12).toString())    
                .attr("y1", migrant_y)      
                .attr("x2", (parseInt(migrant_x)+12).toString())    
                .attr("y2", 210);

                // write name of migrant
                svgM.append("text")
                .attr("id", "migrant-name-label")
                .attr("x", (parseInt(migrant_x)).toString())
                .attr("y", 190)
                .style("font-size", "2.5rem")
                .text(selected_migrant.name)

            }
            else {
                console.log("error: can't locate d3 item for this migrant")
            }

        
            // change text of motivations narrative slide 1
            const narrative1_textContent = $(".m_narrative_1");
            // console.log("NAME, AGE", selected_migrant.name, selected_migrant.age)
            narrative1_textContent.find(".migrant-name").html(selected_migrant.name);
            narrative1_textContent.find(".migrant-age").html(selected_migrant.age);
            narrative1_textContent.find(".migrant-country").html(countryText_motivations[selected_migrant.country]);
            if (selected_migrant_motives.length > 1) {
                narrative1_textContent.find(".migrant-motivation").html(motivDetailAttr[selected_migrant_motives[0]].label + " and " + motivDetailAttr[selected_migrant_motives[1]].label); 
            }
            else {
                narrative1_textContent.find(".migrant-motivation").html(motivDetailAttr[selected_migrant_motives[0]].label); 
            }
            narrative1_textContent.css("width","70%");

            // change text of motivations narrative slide 2
            const narrative2_textContent = $(".m_narrative_2");
            narrative2_textContent.find(".migrant-motiv-narrative").html(selected_migrant.narrative2);
            narrative2_textContent.css("width","70%");

            $(".carousel-caption").css("display","flex");
            $(".carousel-caption").css("justify-content","center");
            $(".carousel-caption").css("align-items","center");

            if (migrant_id == 4124) {
                $(".m_narrative_2").css("font-size","0.9rem");
                $(".c_narrative_2").css("font-size","0.9rem");
            }

            if (migrant_id == 351) {
                $(".c_narrative_2").css("font-size","0.8rem");
            }

            if (migrant_id == 477) {
                $(".m_narrative_2").css("font-size","0.9rem");
            }
        }
    });

// FUNCTIONS
// motivations index order
function sortCompare(a, z) {
    return (a == z) ? 0
    : (a < z) ? -1
    : 1;
}

// motivations lookup for colors and label text
function motivDetailText(motivRsp, sortBy, motivCat) {
    let motivDetailStr = "";

    if (typeof(motivRsp) == "string") {
        let motivList = motivRsp.split(' ');
        if (sortBy == "motivs") {
            motivList = motivList.filter(item => motivAttr[motivCat].responses.includes(item));
        }
        
        for (let i = 0; i < motivList.length; i++) {
            if (!motivDetailStr) {
                motivDetailStr += "<span style='color:" + motivDetailAttr[motivList[i]].color + "'>" + sentenceCase(motivDetailAttr[motivList[i]].label) + "</span>";
            }
            else {
                motivDetailStr += ", <span style='color:" + motivDetailAttr[motivList[i]].color + "'>" + motivDetailAttr[motivList[i]].label + "</span>";
            }
        }
    }
    else {
        motivDetailStr += "<span style='color:" + motivDetailAttr[motivRsp].color + "'>" + sentenceCase(motivDetailAttr[motivRsp].label) + "</span>";
    }
    return motivDetailStr;
}

// create tooltip
function motivsTooltipHtml(d, shape) {
    $("#tt-motivs").empty();
    const tooltipTemplate = $(".tooltip-motivs.template");
    const tooltip = tooltipTemplate.clone();

    if (shape == "sq") {
        motivCat = d.motiv_cat.split('-')[0];
    }
    else if (shape == "tri-bl") {
        const motiv = d.mig_ext_motivo.split(' ')[0];
        motivCat = motivDetailAttr[motiv].category;
    }
    else if (shape == "tri-tr") {
        const motiv1 = d.mig_ext_motivo.split(' ')[0];
        const motivCat1 = d.motiv_cat.split('-')[0];
        const motivCat2 = d.motiv_cat.split('-')[1];
        if (motivDetailAttr[motiv1].category == motivCat1) {
            motivCat = motivCat2;
        }
        else {
            motivCat = motivCat1;
        }
    }
    else if (shape == "tri-t") {
        const motiv2 = d.mig_ext_motivo.split(' ')[1];
        motivCat = motivDetailAttr[motiv2].category;
    }
    else if (shape == "tri-r") {
        const motiv3 = d.mig_ext_motivo.split(' ')[2];
        motivCat = motivDetailAttr[motiv3].category;
    }

    if (motivSort == "income") {
        surveyedLabel = incomeAttr[d.income_per_capita_tier].label;
        motivPct = roundAccurately(motivationsData.filter((item) => item.motiv_cat.includes(motivCat) && item.income_per_capita_tier == d.income_per_capita_tier).length / motivationsData.filter((item) => item.income_per_capita_tier == d.income_per_capita_tier).length * 100, 0);
    }
    else if (motivSort == "cari") {
        surveyedLabel = cariAttr[d.CARI].label;
        motivPct = roundAccurately(motivationsData.filter((item) => item.motiv_cat.includes(motivCat) && item.CARI == d.CARI).length / motivationsData.filter((item) => item.CARI == d.CARI).length * 100, 0);
    }
    else {
        surveyedLabel = "surveyed";
        motivPct = roundAccurately(motivationsData.filter((item) => item.motiv_cat.includes(motivCat)).length / motivationsData.length * 100, 0);
    }

    const motivColor = motivAttr[motivCat].color;
    const motivLabel = motivAttr[motivCat].label;
    const countryLabel = countryText_motivations[d.country];

    tooltip.find(".side-color").css("background", motivColor);
    tooltip.find(".text-color").css("color", motivColor);
    tooltip.find(".label-motiv-pct").html(motivPct);
    tooltip.find(".label-motiv").html(motivLabel);
    tooltip.find(".label-hh").html(surveyedLabel);
    tooltip.find(".label-motiv-detail").html(motivDetailText(d.mig_ext_motivo, motivSort, motivCat));
    tooltip.find(".label-country").html(countryLabel);

    tooltip.children().appendTo("#tt-motivs");
}
// tooltip position on mousemove
function divMotivsOnMousemove(event) {
    if (winWidth > 768) {
        divMotivs
        .style("top", (divHtml) => {
            var divY = event.pageY;
            var ttHeight = $("#tt-motivs").outerHeight();
            var divHeight = $("#viz-motivations").height();

            if ((divY + ttHeight + 60) > winHeight) {
                divY = divY - ttHeight - 15;
            };
            return (divY + 5) + "px"
        })
        .style("left", (divHtml) => {
            var divX = event.pageX;
            var ttWidth = $("#tt-motivs").outerWidth();
            var divWidth = $("#viz-motivations").width();

            if ((divX + ttWidth) > divWidth) {
                divX = divX - ttWidth - 15;
            };
            return (divX + 5) + "px"
        })
    }
    else {
        divMotivs.style("top", "1rem")
            .style("left", "57%");
    }
}

// update sort index position
function indexPos(d, sortBy, triPos) {
    let sortIndex = motivsIndex[d.rsp_id2][sortBy];

    // motivations layout rearange index
    if (sortBy == "motivs") {
        if (triPos == "botLeft") {
            // to oth from sec
            if (1530 <= sortIndex && sortIndex <= 1538) {
                sortIndex += (14 * numPerRow) + 35;
            }
            // to oth from reun
            else if (1477 <= sortIndex && sortIndex <= 1486) {
                sortIndex += (15 * numPerRow) + 22;
            }
            // to oth from econ
            else if (1366 <= sortIndex && sortIndex <= 1379) {
                sortIndex += (17 * numPerRow) + 7;
            }
            // to clim from econ
            else if (1302 <= sortIndex && sortIndex <= 1305) {
                sortIndex += (13 * numPerRow) - 14;
            }
            // security
            else if (1520 <= sortIndex && sortIndex <= 1529) {
                sortIndex += (4 * numPerRow) + 25;
            }
            // to sec from econ (3 categories)
            else if (d.rsp_id2 == 'rsp1358-5') {
                sortIndex += (7 * numPerRow) + 9;
            }
            // to sec from econ
            else if (1237 <= sortIndex && sortIndex <= 1252) {
                sortIndex += (9 * numPerRow) + 47;
            }
            // reun
            else if (1463 <= sortIndex && sortIndex <= 1476) {
                sortIndex += 12 + numPerRow;
            }
            // to reun from econ (3 categories)
            else if (d.rsp_id2 == 'rsp1364' || d.rsp_id2 == 'rsp1450') {
                sortIndex += 3*numPerRow - 5;
            }
            // to reun from econ (last 2 flipped)
            else if (1174 <= sortIndex && sortIndex <= 1183) {
                sortIndex += (7 * numPerRow) - 18;
            }
            // econ (and sec)
            else if (d.motiv_cat.includes("sec") && 1184 <= sortIndex && sortIndex <= 1236) {
                sortIndex -= 29;
            }
            // econ (and clim) (flipped)
            else if (d.motiv_cat.includes("clim") && 1253 <= sortIndex && sortIndex <= 1301) {
                sortIndex -= 53;
            }
            // econ (and oth)
            else if (d.motiv_cat.includes("oth") && 1306 <= sortIndex && sortIndex <= 1365) {
                sortIndex -= (2 * numPerRow) - 14;
            }
            // econ (3 categories)
            else if (1380 <= sortIndex && sortIndex <= 1382) {
                sortIndex -= 2 * numPerRow;
            }
            // econ (3 categories)
            else if (d.rsp_id2 == "rsp1039-2") {
                sortIndex -= (2* numPerRow) + 6;
            }
            else if (d.rsp_id2 == "rsp1418-1") {
                sortIndex -= (2* numPerRow) + 7;
            }
        }
        else if (triPos == "topRight") {
            // to oth from sec (flipped)
            if (1521 <= sortIndex && sortIndex <= 1529) {
                sortIndex += (15 * numPerRow) - 3;
            }
            // to oth from reun (flipped)
            else if (1463 <= sortIndex && sortIndex <= 1476) {
                sortIndex += (16 * numPerRow) + 8;
            }
            // to oth from econ (flipped)
            else if (d.rsp_id2 == 'rsp4864' || d.rsp_id2 == 'rsp4867' || d.rsp_id2 == 'rsp4957-2') {
                sortIndex += (18 * numPerRow) + 10;
            }
            // to oth from econ
            else if (1306 <= sortIndex && sortIndex <= 1362) {
                sortIndex += (18 * numPerRow) + 11;
            }
            // to clim from econ
            else if (1253 <= sortIndex && sortIndex <= 1301) {
                // 1279 - 1301
                sortIndex += (13 * numPerRow) + 35;
            }
            // sec (flipped)
            else if (1529 <= sortIndex && sortIndex < 1538) {
                sortIndex += (4 * numPerRow) + 25;
            }
            // to sec from econ (flipped)
            else if (d.rsp_id2 == 'rsp4510' || d.rsp_id2 == 'rsp4515' || d.rsp_id2 == 'rsp4560-1' || d.rsp_id2 == 'rsp4703-1' || d.rsp_id2 == 'rsp4703-2' || d.rsp_id2 == 'rsp4723' || d.rsp_id2 == 'rsp4738' || d.rsp_id2 == 'rsp4805' || d.rsp_id2 == 'rsp4959' || d.rsp_id2 == 'rsp4489-2') {
                sortIndex += (10 * numPerRow) + 17;
            }
            // to sec from econ
            else if (1184 <= sortIndex && sortIndex <= 1226) {
                sortIndex += (10 * numPerRow) + 25;
            }
            // reun
            else if (1477 <= sortIndex && sortIndex <= 1486) {
                sortIndex -= -numPerRow + 2;
            }
            // to reun from sec (flipped)
            else if (d.rsp_id2 == 'rsp1418-2') {
                sortIndex -= -numPerRow + 31;
            }
            // to reun from econ
            else if (1155 <= sortIndex && sortIndex <= 1173) {
                sortIndex += (7 * numPerRow) - 6;
            }
            // econ (and sec)
            else if (d.motiv_cat.includes("sec") && 1237 <= sortIndex && sortIndex <= 1252) {
                sortIndex -= 53;
            }
            // econ (and clim)
            else if (d.motiv_cat.includes("clim") && 1302 <= sortIndex && sortIndex <= 1305) {
                sortIndex -= 53;
            }
            // econ (and oth)
            else if (d.motiv_cat.includes("oth") && 1366 <= sortIndex && sortIndex <= 1379) {
                sortIndex -= (2 * numPerRow) + 1;
            }
        }
        else if (triPos == "top") {
            // to oth from econ
            if (d.rsp_id2 == 'rsp3254') {
                sortIndex += (18 * numPerRow) - 6;
            }
            // to clim from econ
            if (d.rsp_id2 == 'rsp1418-1') {
                sortIndex += (12 * numPerRow) - 17;
            }
            // to sec from econ
            if (d.rsp_id2 == 'rsp1039-2') {
                sortIndex += (8 * numPerRow) - 21;
            }
            // to reun from sec
            if (d.rsp_id2 == 'rsp999') {
                sortIndex -= -numPerRow + 36;
            }
            // to reun from econ
            if (d.rsp_id2 == 'rsp3187-1' || d.rsp_id2 == 'rsp3187-2') {
                sortIndex += 3*numPerRow + 11;
            }
            // econ (3 categories)
            else if (d.rsp_id2 == "rsp1364" || d.rsp_id2 == "rsp1450") {
                sortIndex -= (2 * numPerRow) + 2;
            }
            // econ (3 categories) (flip to right)
            else if (d.rsp_id2 == "rsp1358-5") {
                sortIndex -= (2 * numPerRow) + 5;
            }
        }
        else if (triPos == "right") {
            // to oth from econ
            if (d.rsp_id2 == 'rsp3187-1' || d.rsp_id2 == 'rsp3187-2') {
                sortIndex += (18 * numPerRow) - 6;
            }
            // to oth from econ (flip to top)
            if (d.rsp_id2 == 'rsp1364' || d.rsp_id2 == 'rsp1450') {
                sortIndex += (18 * numPerRow) - 9;
            }
            // sec
            else if (d.rsp_id2 == 'rsp999') {
                sortIndex += 5*numPerRow - 6;
            }
            // to sec from econ
            else if (d.rsp_id2 == 'rsp1418-1') {
                sortIndex += (8 * numPerRow) - 22;
            }
            // to reun from econ
            else if (d.rsp_id2 == 'rsp3254') {
                sortIndex += 3*numPerRow + 8;
            }
            // to reun from econ
            else if (d.rsp_id2 == 'rsp1039-2' || d.rsp_id2 == 'rsp1358-5') {
                sortIndex += 3*numPerRow + 6;
            }
        }
        // if 1 category (square)
        else {
            // other
            if (1539 <= sortIndex) {
                sortIndex += (12 * numPerRow) + 29; // 12
            }
            // security
            else if (1487 <= sortIndex && sortIndex < 1539) {
                sortIndex += (4 * numPerRow) + 25; // 4
            }
            // reunion
            else if (1388 <= sortIndex && sortIndex < 1487) {
                sortIndex += 12 + numPerRow; // 2
            }
        }
    }
    else if (sortBy == "income") {
        // income tier 6
        if (1610 <= sortIndex) {
            sortIndex += (17 * numPerRow) + 14;
        }
        // income tier 5
        else if (1463 <= sortIndex && sortIndex < 1610) {
            sortIndex += (13 * numPerRow) + 49;
        }
        // income tier 4
        else if (942 <= sortIndex && sortIndex < 1463) {
            sortIndex += (10 * numPerRow) + 10;
        }
        // income tier 3
        else if (626 <= sortIndex && sortIndex < 942) {
            sortIndex += (6 * numPerRow) + 46;
        }
        // income tier 2
        else if (316 <= sortIndex && sortIndex < 626) {
            // if (143 < sortIndex) {
            //     sortIndex += numPerRow + 20 + ((sortIndex - 143) / numPerRow.income[2]);
            // }
            // else {
                sortIndex += (3 * numPerRow) + 20;
            // }
        }
        // income tier 1
        // else {
        //     if (215 < sortIndex) {
        //         sortIndex += numPerRow + Math.floor((sortIndex - 216) / (numPerCol.income[1] - 1)) - (9 * numPerCol.income[1] + 2);
        //     }
        // }
    }
    else if (sortBy == "cari") {
        // cari score 4
        if (1624 <= sortIndex) {
            sortIndex += 5;
        }
        if (1619 <= sortIndex && sortIndex < 1624) {
            sortIndex += (5 * numPerRow) + 5;
        }
        // cari score 3
        else if (1474 <= sortIndex && sortIndex < 1619) {
            sortIndex += (7 * numPerRow) + 43;
        }
        // cari score 2
        if (749 <= sortIndex && sortIndex < 1474) {
            sortIndex += (3 * numPerRow) + 35;
        }
    }
    return sortIndex;
}
// select scale
function selectScale(d, nPos, sortBy) {
    const sortIndex = indexPos(d, sortBy);
    if (nPos == "nx") {
        // if (sortBy == "income" || sortBy == "cari") {
        // if (sortBy == "income" && d.income_per_capita_tier == 2) {
        //     if (sortBy == "income") {
        //         numPerColValue = numPerCol.income[d.income_per_capita_tier];
        //     }
        //     else if (sortBy == "cari") {
        //         numPerColValue = numPerCol.cari[d.CARI];
        //     }
        //     const nx = Math.floor(sortIndex / numPerColValue);
        //     const scaleVertical = d3.scaleLinear()
        //         .domain([0, numPerColValue])
        //         .range([0, sqLen * numPerColValue]);
        //     return scaleVertical(nx);
        // }
        // else {
            const nx = sortIndex % numPerRow;
            return scale(nx);
        // }
    }
    else if (nPos == "ny") {
        // if (sortBy == "income" || sortBy == "cari") {
        // if (sortBy == "income" && d.income_per_capita_tier == 2) {
        //     if (sortBy == "income") {
        //         numPerColValue = numPerCol.income[d.income_per_capita_tier];
        //     }
        //     else if (sortBy == "cari") {
        //         numPerColValue = numPerCol.cari[d.CARI];
        //     }
        //     const ny = sortIndex % numPerColValue;
        //     const scaleVertical = d3.scaleLinear()
        //         .domain([0, numPerColValue])
        //         .range([0, sqLen * numPerColValue]);
        //     return scaleVertical(ny);
        // }
        // else {
            const ny = Math.floor(sortIndex / numPerRow);
            return shift_amount+scale(ny);
        // }
    }
}

// triangle path
function trianglePath(d, sortBy, triPos) {
    

    // if (sortBy == "income" && d.income_per_capita_tier == 2) {
    //     const nx = selectScale(d, "nx", sortBy);
    //     const ny = selectScale(d, "ny", sortBy);

    //     if (triPos == "botLeft") {
    //         triPath = "M " + nx + " " + (ny) + " L " + nx + " " + (ny + sqLen) + " L " + (nx + sqLen) + " " + (ny + sqLen) + " Z";
    //     }
    //     else if (triPos == "topRight") {
    //         triPath = "M " + nx + " " + ny + " L " + (nx + sqLen) + " " + ny + " L " + (nx + sqLen) + " " + (ny + sqLen) + " Z";
    //     }
    //     else if (triPos == "top") {
    //         triPath = "M " + nx + " " + ny + " L " + (nx + sqLen) + " " + ny + " L " + (nx + sqLen/2) + " " + (ny + sqLen/2) + " Z";
    //     }
    //     else if (triPos == "right") {
    //         triPath = "M " + (nx + sqLen/2) + " " + (ny + sqLen/2) + " L " + (nx + sqLen) + " " + (ny) + " L " + (nx + sqLen) + " " + (ny + sqLen) + " Z";
    //     }
    // }
    // else {
        const sortIndex = indexPos(d, sortBy, triPos);
    
        const nx = sortIndex % numPerRow;
        const ny = Math.floor(sortIndex / numPerRow);

        if (triPos == "botLeft") {
            if (sortBy == "motivs" && (
                (d.motiv_cat.includes("reun") && 1155 <= sortIndex && sortIndex <= 1174) || 
                (d.motiv_cat.includes("clim") && 1253 - 53 <= sortIndex && sortIndex <= 1301 - 53) || 
                (d.rsp_id2 == "rsp1039-2") || 
                (d.rsp_id2 == "rsp1418-1")
            )) {
                // flip to top right
                triPath = "M " + scale(nx) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny)) + sqLen) + " Z";
            }
            else {
                triPath = "M " + scale(nx) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + scale(nx) + " " + (shift_amount+parseInt(scale(ny)) + sqLen) + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny)) + sqLen) + " Z";
            }
        }
        else if (triPos == "topRight") {
            if (sortBy == "motivs" && (
                (d.motiv_cat == "sec-oth-2" && (1521 + (15 * numPerRow) - 3) <= sortIndex && sortIndex <= (1529 + (15 * numPerRow) - 3)) || 
                (d.motiv_cat == "reun-oth-2" && (1463 + (16 * numPerRow) + 8) <= sortIndex && sortIndex <= (1476 + (16 * numPerRow) + 8)) || 
                (d.rsp_id2 == 'rsp4864' || d.rsp_id2 == 'rsp4867' || d.rsp_id2 == 'rsp4957-2') || 
                (d.motiv_cat == "sec-oth-2" && (1529 + 25 + (4 * numPerRow) <= sortIndex && sortIndex < 1538 + 25 + (4 * numPerRow))) || 
                (d.rsp_id2 == 'rsp4510' || d.rsp_id2 == 'rsp4515' || d.rsp_id2 == 'rsp4560-1' || d.rsp_id2 == 'rsp4703-1' || d.rsp_id2 == 'rsp4703-2' || d.rsp_id2 == 'rsp4723' || d.rsp_id2 == 'rsp4738' || d.rsp_id2 == 'rsp4805' || d.rsp_id2 == 'rsp4959' || d.rsp_id2 == 'rsp4489-2') || 
                (d.rsp_id2 == 'rsp1418-2') || 
                (d.rsp_id2 == 'rsp4718-4' || d.rsp_id2 == 'rsp4957-1')
            )) {
                // flip to bottom left
                triPath = "M " + scale(nx) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + scale(nx) + " " + (shift_amount+parseInt(scale(ny)) + sqLen) + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny)) + sqLen) + " Z";
            }
            else if (sortBy == "motivs" && d.motiv_cat.includes("clim") && (1279 + (13 * numPerRow) + 35) <= sortIndex && sortIndex <= (1301 + (13 * numPerRow) + 35)) {
                // flip to bottom left and shift left 22
                const nx = (sortIndex - 22) % numPerRow;
                const ny = Math.floor((sortIndex - 22) / numPerRow);
                triPath = "M " + scale(nx) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + scale(nx) + " " + (shift_amount+parseInt(scale(ny)) + sqLen) + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny)) + sqLen) + " Z";
            }
            else {
                triPath = "M " + scale(nx) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny)) + sqLen) + " Z";
            }
        }
        else if (triPos == "top") {
            if (sortBy == "motivs" && d.rsp_id2 == "rsp1358-5") {
                // flip to right
                triPath = "M " + (scale(nx) + sqLen/2) + " " + (shift_amount+parseInt(scale(ny)) + sqLen/2) + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny)) + sqLen) + " Z";
            }
            else {
                triPath = "M " + scale(nx) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + (scale(nx) + sqLen/2) + " " + (shift_amount+parseInt(scale(ny)) + sqLen/2) + " Z";
            }
        }
        else if (triPos == "right") {
            if (sortBy == "motivs" && (d.rsp_id2 == 'rsp1364' || d.rsp_id2 == 'rsp1450')) {
                // flip to top
                triPath = "M " + scale(nx) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + (scale(nx) + sqLen/2) + " " + (shift_amount+parseInt(scale(ny)) + sqLen/2) + " Z";
            }
            else {
                triPath = "M " + (scale(nx) + sqLen/2) + " " + (shift_amount+parseInt(scale(ny)) + sqLen/2) + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny))).toString() + " L " + (scale(nx) + sqLen) + " " + (shift_amount+parseInt(scale(ny)) + sqLen) + " Z";
            }
        }
    // }
    return triPath;
}

// plot initial squares grid
function plotInitialGrid(data) {
    // squares
    svgM.append("g")
            .attr("class", "g-sq")
        .selectAll("rect")
        .data(data.filter(item => item.motiv_cat.endsWith('1')))
        .enter()
        .append("rect")
            .attr("id", d => "sq-" + d.rsp_id2)
            .attr("class", d => "square income-" + d.income_per_capita_tier)
            .attr("x", d => {
                const iInitial = motivsIndex[d.rsp_id2].initial;
                const nx = iInitial % numPerRow;
                return scale(nx);
            })
            .attr("y", d => {
                const iInitial = motivsIndex[d.rsp_id2].initial;
                const ny = Math.floor(iInitial / numPerRow);
                return shift_amount+scale(ny);
            })
            .attr("width", sqLen)
            .attr("height", sqLen)
            .attr("fill", d => {
                const motiv = d.motiv_cat.split('-')[0];
                return motivAttr[motiv].color;
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", gap)
        .on("mouseover", function(event, d) {
            motivsTooltipHtml(d, "sq");
            // responsive - show only if MED screen or larger
            if (winWidth > 768) {
                divMotivs.style("display", "block");
                setTimeout(() => {
                    if (divMotivs.style("display") == "block") {
                        $("#tt-motivs").fadeOut();
                    }
                }, 5000)
            }
        })
        .on("mousemove", function(event) {
            divMotivsOnMousemove(event);
        })
        .on("mouseout", function() {
            if (winWidth > 768) {
                divMotivs.style("display", "none");
            }
        });

    // triangle bottom-left
    svgM.append("g")
            .attr("class", "g-tri-bl")
        .selectAll("path")
        .data(data.filter(item => !item.motiv_cat.endsWith('1')))
        .enter()
        .append("path")
            .attr("id", d => "tri-bl-" + d.rsp_id2)
            .attr("class", "tri-bl")
            .attr("d", d => trianglePath(d, "initial", "botLeft"))
            .attr("fill", d => {
                const motiv = d.mig_ext_motivo.split(' ')[0];
                return motivDetailAttr[motiv].color;
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", gap)
        .on("mouseover", function(event, d) {
            motivsTooltipHtml(d, "tri-bl");
            // responsive - show only if MED screen or larger
            if (winWidth > 768) {
                divMotivs.style("display", "block");
                setTimeout(() => {
                    if (divMotivs.style("display") == "block") {
                        $("#tt-motivs").fadeOut();
                    }
                }, 5000)
            }
        })
        .on("mousemove", function(event) {
            divMotivsOnMousemove(event);
        })
        .on("mouseout", function() {
            if (winWidth > 768) {
                divMotivs.style("display", "none");
            }
        });
        
    // triangle top-right for 2 responses
    svgM.append("g")
            .attr("class", "g-tri-tr")
        .selectAll("path")
        .data(data.filter(item => item.motiv_cat.endsWith('2')))
        .enter()
        .append("path")
            .attr("id", d => "tri-tr-" + d.rsp_id2)
            .attr("class", "tri-tr")
            .attr("d", d => trianglePath(d, "initial", "topRight"))
            .attr("fill", d => {
                const motiv1 = d.mig_ext_motivo.split(' ')[0];
                const motivCat1 = d.motiv_cat.split('-')[0];
                const motivCat2 = d.motiv_cat.split('-')[1];
                if (motivDetailAttr[motiv1].category == motivCat1) {
                    return motivAttr[motivCat2].color;
                }
                else {
                    return motivAttr[motivCat1].color;
                }
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", gap)
        .on("mouseover", function(event, d) {
            motivsTooltipHtml(d, "tri-tr");
            // responsive - show only if MED screen or larger
            if (winWidth > 768) {
                divMotivs.style("display", "block");
                setTimeout(() => {
                    if (divMotivs.style("display") == "block") {
                        $("#tt-motivs").fadeOut();
                    }
                }, 5000)
            }
        })
        .on("mousemove", function(event) {
            divMotivsOnMousemove(event);
        })
        .on("mouseout", function() {
            if (winWidth > 768) {
                divMotivs.style("display", "none");
            }
        });

    // triangle top for 3 responses
    svgM.append("g")
            .attr("class", "g-tri-t")
        .selectAll("path")
        .data(data.filter(item => item.motiv_cat.endsWith('3')))
        .enter()
        .append("path")
            .attr("id", d => "tri-t-" + d.rsp_id2)
            .attr("class", "tri-t")
            .attr("d", d => trianglePath(d, "initial", "top"))
            .attr("fill", d => {
                const motiv2 = d.mig_ext_motivo.split(' ')[1];
                return motivDetailAttr[motiv2].color;
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", gap)
        .on("mouseover", function(event, d) {
            motivsTooltipHtml(d, "tri-t");
            // responsive - show only if MED screen or larger
            if (winWidth > 768) {
                divMotivs.style("display", "block");
                setTimeout(() => {
                    if (divMotivs.style("display") == "block") {
                        $("#tt-motivs").fadeOut();
                    }
                }, 5000)
            }
        })
        .on("mousemove", function(event) {
            divMotivsOnMousemove(event);
        })
        .on("mouseout", function() {
            if (winWidth > 768) {
                divMotivs.style("display", "none");
            }
        });

    // triangle right for 3 responses
    svgM.append("g")
            .attr("class", "g-tri-r")
        .selectAll("path")
        .data(data.filter(item => item.motiv_cat.endsWith('3')))
        .enter()
        .append("path")
            .attr("id", d => "tri-r-" + d.rsp_id2)
            .attr("class", "tri-r")
            .attr("d", d => trianglePath(d, "initial", "right"))
            .attr("fill", d => {
                const motiv3 = d.mig_ext_motivo.split(' ')[2];
                return motivDetailAttr[motiv3].color;
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", gap)
        .on("mouseover", function(event, d) {
            motivsTooltipHtml(d, "tri-r");
            // responsive - show only if MED screen or larger
            if (winWidth > 768) {
                divMotivs.style("display", "block");
                setTimeout(() => {
                    if (divMotivs.style("display") == "block") {
                        $("#tt-motivs").fadeOut();
                    }
                }, 5000)
            }
        })
        .on("mousemove", function(event) {
            divMotivsOnMousemove(event);
        })
        .on("mouseout", function() {
            if (winWidth > 768) {
                divMotivs.style("display", "none");
            }
        });

    // motivations categories legend
    const legend = svgM.append("g")
        .attr("class", "legend")
    
    // legend squares
    legend.append("g")
            .attr("class", "legend-sq")
        .selectAll("rect")
        .data(motivsList)
        .enter()
        .append("rect")
            .attr("x", d => scale(motivAttr[d].xPosLegend))
            .attr("y", (top_margin_amount+parseInt(scale(0))).toString()) // row number (1624/numPerRow + 9) 
            .attr("width", sqLen)
            .attr("height", sqLen)
            .attr("fill", d => motivAttr[d].color)
            .attr("stroke", "#fff")
            .attr("stroke-width", gap);

    // legend text
    legend.append("g")
            .attr("class", "legend-text")
        .selectAll("text")
        .data(motivsList)
        .enter()
        .append("text")
        .attr("x", d => scale(motivAttr[d].xPosLegend + 1.25))
        .attr("y", (top_margin_amount+parseInt(scale(1))).toString())
        .attr("dy", "-0.125em")
        .attr("text-anchor", "start")
        .attr("fill", d => motivAttr[d].color)
        .text(d => motivAttr[d].label.toUpperCase());

    // text for split
    legend.append("g")
            .attr("id", "select-multiple")
            .attr("class", "legend-text")
        .selectAll("text")
        .data([legendSplit])
        .enter()
        .append("text")
        .attr("x", d => scale(d.nx + 1.25))
        .attr("y", d => (top_margin_amount+parseInt(scale(1))).toString())
        .attr("transform", "translate(0 56)")
        .attr("dy", "-0.125em")
        .attr("text-anchor", "start")
        .attr("fill", "#777")
        .text(d => d.label.toUpperCase());

    // legend bottom-left triangle
    legend.append("g")
            .attr("class", "legend-tri-bl")
        .selectAll("path")
        .data([legendSplit])
        .enter()
        .append("path")
        .attr("d", d => {
            return "M " + scale(d.nx) + " " + (top_margin_amount+parseInt(scale(0))).toString() + " L " + scale(d.nx) + " " + (top_margin_amount+parseInt(scale(0)) + sqLen) + " L " + (scale(d.nx) + sqLen) + " " + (top_margin_amount+parseInt(scale(0)) + sqLen) + " Z";
        })
        .attr("transform", "translate(0 56)")
        .attr("fill", d => motivAttr[d.colorCat1].color)
        .attr("stroke", "#fff")
        .attr("stroke-width", gap);

    // legend bottom-left triangle
    legend.append("g")
            .attr("class", "legend-tri-tr")
        .selectAll("path")
        .data([legendSplit])
        .enter()
        .append("path")
        .attr("d", d => {
            return "M " + scale(d.nx) + " " + (top_margin_amount+parseInt(scale(0))).toString() + " L " + (scale(d.nx) + sqLen) + " " + (top_margin_amount+parseInt(scale(0))).toString() + " L " + (scale(d.nx) + sqLen) + " " + (top_margin_amount+parseInt(scale(0)) + sqLen) + " Z";
        })
        .attr("transform", "translate(0 56)")
        .attr("fill", d => motivAttr[d.colorCat2].color)
        .attr("stroke", "#fff")
        .attr("stroke-width", gap);
};

// plot initial squares grid
function updatePlotSort(sortBy) {
    
    // squares
    svgM.select(".g-sq")
        .selectAll("rect")
        .transition()
            .duration(time)
            .attr("x", d => selectScale(d, "nx", sortBy))
            .attr("y", d => selectScale(d, "ny", sortBy));
    
    // triangle bottom-left
    svgM.select(".g-tri-bl")
        .selectAll("path")
        .transition()
            .duration(time)
            .attr("d", d => trianglePath(d, sortBy, "botLeft"));
        
        // triangle top-right
        svgM.select(".g-tri-tr")
            .selectAll("path")
            .transition()
                .duration(time)
                .attr("d", d => trianglePath(d, sortBy, "topRight"));

        // triangle top for 3 responses
        svgM.select(".g-tri-t")
            .selectAll("path")
            .transition()
                .duration(time)
                .attr("d", d => trianglePath(d, sortBy, "top"));

        // triangle right for 3 responses
        svgM.select(".g-tri-r")
            .selectAll("path")
            .transition()
                .duration(time)
                .attr("d", d => trianglePath(d, sortBy, "right"));
}

// plot labels
function plotLabels(labelList, sortBy) {
    // labels
    labelGroup = svgM.append("g")
            .attr("id", "labels-" + sortBy)
            .attr("class", "chart-labels")
    
    labelGroup.append("g")
            .attr("class", "chart-text")
        .selectAll("text")
        .data(labelList)
        .enter()
        .append("text")
            .attr("id", d => "text-" + d.group)
            .attr("x", d => 0)
            .attr("y", d => {
                return (labelList.length == 5) ? shift_amount-45+scale(motivAttr[d.group].yPosSide)
                : (labelList.length == 6) ? shift_amount-45+scale(incomeAttr[d.group].yPosSide)
                : (labelList.length == 3) ? shift_amount-45+scale(cariAttr[d.group].yPosSide)
                : null;
            })
            .attr("dy", "-0.125em")
            // .attr("text-anchor", "end")
            .text(d => {
                return (labelList.length == 5) ? motivAttr[d.group].label.toUpperCase()
                : (labelList.length == 6) ? incomeAttr[d.group].label.toUpperCase()
                : (labelList.length == 3) ? cariAttr[d.group].sideLabel.toUpperCase()
                : null;
            })
            // .call(wrapText, sideWidth)
            // .on("mouseover", function(event, d) {
            //     sideTooltipHtml(d);
            //     divSide.style("top", (divHtml) => {
            //         return (labelList.length == 5) ? ((scale(motivAttr[d.group].yPosSide) - sqLen/2)/height * 100) + "%"
            //         : (labelList.length == 6) ? ((scale(incomeAttr[d.group].yPosSide) - sqLen/2)/height * 100) + "%"
            //         : (labelList.length == 3) ? ((scale(cariAttr[d.group].yPosSide) - sqLen/2)/height * 100) + "%"
            //         : null;
            //         })
            //         .style("left", ((sideWidth + sqLen/2)/width * 100) + "%")
            //         .style("display", "block");
            // })
            // .on("mouseout", function() {
            //     divSide.style("display", "none");
            // });

    // lines
    // labelGroup.append("g")
    //         .attr("class", "chart-lines")
    //     .selectAll("path")
    //     .data(labelList)
    //     .enter()
    //     .append("line")
    //         .attr("x1", -(sideWidth + sqLen))
    //         .attr("x2", -sqLen)
    //         .attr("y1", d => {
    //             return (labelList.length == 5) ? shift_amount+scale(motivAttr[d.group].yPosSide) - 1.5 * sqLen
    //             : (labelList.length == 6) ? shift_amount+scale(incomeAttr[d.group].yPosSide) - 1.5 * sqLen
    //             : (labelList.length == 3) ? shift_amount+scale(cariAttr[d.group].yPosSide) - 1.5 * sqLen
    //             : null;
    //         })
    //         .attr("y2", d => {
    //             return (labelList.length == 5) ? shift_amount+scale(motivAttr[d.group].yPosSide) - 1.5 * sqLen
    //             : (labelList.length == 6) ? shift_amount+scale(incomeAttr[d.group].yPosSide) - 1.5 * sqLen
    //             : (labelList.length == 3) ? shift_amount+scale(cariAttr[d.group].yPosSide) - 1.5 * sqLen
    //             : null;
    //         })
    //         .attr("stroke", "#1540C4")
    //         .attr("stroke-width", 2)
}

// button functions
$("#buttons-motivations .btn").on("click", function() {
    btnId = "#" + $(this).attr("id");
    sortBy = $(this).attr("id").slice(4);
    labelsId = "#frame-motivations #labels-" + sortBy;

    if ($(btnId).hasClass("active")) {
        motivSort = "initial";
            // $("#migrant-line").css("display", "block")
        // $("#migrant-name-label").css("display", "block")
        $("#migrant-line").fadeIn(time/2);
        $("#migrant-name-label").fadeIn(time/2);
        $(btnId).removeClass("active");
        $(labelsId).fadeOut(time/2);
        updatePlotSort("initial")
    }
    else {
        motivSort = sortBy;
        // $("#migrant-line").css("display", "none")
        // $("#migrant-name-label").css("display", "none")
        $("#migrant-line").fadeOut(time/2);
        $("#migrant-name-label").fadeOut(time/2);
        $("#buttons-motivations .btn").removeClass("active");
        $(".chart-labels").fadeOut(time/2);
        $(btnId).addClass("active");
        $(labelsId).delay(time/2).fadeIn(time/2);
        updatePlotSort(sortBy);
    }
});

// document ready
$(document).ready(function() {
    function getDivHeight(id) {
        return $(id).height();
    };

    $("#tt-motivs").css("display", "none");
})

// window resize
$(window).resize(function() {
    if (winWidth < 768) {
        divMotivs.style("display", "none");
    }
    // else {
    //     divMotivs.style("display", "block");
    // }
})

//window rotate alert
