function init() {
    var dropdownMenu = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        data.names.forEach(sampleName => {
            dropdownMenu
                .append("option")
                .property("value", sampleName)
                .text(sampleName);
        });
    });
}





function optionChanged(sample){
    metadata(sample);
    chart(sample);
}
function metadata(sample) {

    d3.json("samples.json").then((data) => {
        var meta = data.metadata;
        console.log("from metadata", meta)
        //filtering the data to match the user selection
        var idData = meta.filter(object => object.id = sample);
        var id = idData[0];
        console.log("id= ", id);
        var panel = d3.select("#sample-metadata")
        panel.html("");//clear demograohic info table

        Object.entries(id).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function chart(sample) {
    d3.json("samples.json").then((data) => {
        var sampleData = data.samples;
        console.log("from chart", sampleData)
        var idData = sampleData.filter(object => object.id = sample);
        var id = idData[0];
        var otu_ids = id.otu_ids;
        var sample_values = id.sample_values;
        var otu_labels = id.otu_labels;

        var layout = {
            title: "Bacteria in the Stomach",
            margin: { t: 0 },
            hovermode: "top",
            xaxis: { title: "Bacterial ID" },
            margin: { t: 35 }
        };
        console.log("from layout", data)
        var chart = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids
                }
            }
        ];
        Plotly.newPlot("bubble", chart, layout);
        console.log("from bubble", data)
        var tickMarks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var bar = [
            {
                y: tickMarks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];
        var blayout = {
            title: "Top 10 Bacteria",
            margin: { t: 35, l: 90 }
        };

        Plotly.newPlot("bar", bar, blayout);
    });
}

init();

// d3.selectAll("#selDataset").on("change", metadata);

