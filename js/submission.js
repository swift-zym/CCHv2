
var submissionLastOperated = new Date(0);
function openSubmission(c, u){
	if(!RunInNwjs){
		openURL(settings.mainURL + '/contest/' + c + '/submission/' + u);
		return;
	}
	submissionLastOperated = new Date();
	var T = submissionLastOperated;
	$(".HtmlContainer > div > .loadingInterface").css("display", "grid");
	$(".HtmlContainer > div > .loadingInterface > div:first-child").css("display", "block");
	$(".HtmlContainer > div > .loadingInterface > div:last-child").css("display", "none");
	setTimeout(function(){$(".HtmlContainer > div > .loadingInterface").css("opacity", 1);}, 100);
	$(".HtmlContainer > div > .loadingInterface > div:first-child > i").attr("class", 'fas fa-spin fa-sync-alt');
	var data;
	function loader(callback){
		$.ajax({
			url: settings.mainURL + '/contest/' + c + '/submission/' + u,
			success: function(j){
				if(T.getTime() != submissionLastOperated.getTime())	return;
				data = $(j);
				setTimeout(callback, 100);
			},
			error: function(){
				if(T.getTime() != submissionLastOperated.getTime())	return;
				$(".HtmlContainer > div > .loadingInterface > div:first-child > i").css("opacity", 0);
				setTimeout(function(){
					$(".HtmlContainer > div > .loadingInterface > div:first-child > i").attr("class", 'fas fa-unlink');
					setTimeout(function(){
						$(".HtmlContainer > div > .loadingInterface > div:first-child > i").css("opacity", 1);
					}, 100)
				}, 500);
				setTimeout(function(){
					$(".HtmlContainer > div > .loadingInterface > div:first-child > i").css("opacity", 0);
					setTimeout(function(){
						$(".HtmlContainer > div > .loadingInterface > div:first-child > i").attr("class", 'fas fa-spin fa-sync-alt');
						setTimeout(function(){
							$(".HtmlContainer > div > .loadingInterface > div:first-child > i").css("opacity", 1);
						}, 100)
						loader(callback);
					}, 500);
				}, 9500);
			}
		})
	}
	function getF(x){
		for(var i=0; i<x.length; i++){
			var p = x[i];
			if(Number(p) != undefined && Number(p) != 0)
				return Number(p);
		}
		return 0;
	}
	function req(){
		var ctN = data.find("table").eq(0).find("tr").eq(0);
		var ctL = data.find("table").eq(0).find("tr").eq(1);
		$(".HtmlContainer > div > .loadingInterface").css("display", "block");
		$(".HtmlContainer > div > .loadingInterface > div:last-child").css("display", "block");
		$(".HtmlContainer > div > .loadingInterface > div:first-child").css("display", "none");
		$(".submissionUsername").html();
		$(".submissionProblem").html(ctL.children().eq(2).find("a").text());
		$(".submissionLanguage").html(ctL.children().eq(3).text());
		$(".submissionVerdict").html(ctL.children().eq(4).text());
		$(".submissionVerdict").attr("class", "submissionVerdict");
		if(ctL.children().eq(4).children().eq(0).hasClass("verdict-accepted"))
			$(".submissionVerdict").addClass("green");
		if(ctL.children().eq(4).children().eq(0).hasClass("verdict-failed"))
			$(".submissionVerdict").addClass("red");
		if(ctN.children().eq(5).text() == "Time")
			$(".submissionTime").html(ctL.children().eq(5).text());
		else $(".submissionTime").html("?");
		if(ctN.children().eq(6).text() == "Memory")
			$(".submissionMemory").html(toMemoryInfo(Number(getF(ctL.children().eq(6).text().split(" "))) * 1024));
		else $(".submissionMemory").html("?");
		$(".submissionCode > code").html(allHtmlSpecialChars(data.find("#program-source-text").text()));
		$(".submissionCode").html("<code></code>");
		$(".jumpToSubmission").attr("onclick", `openURL('${settings.mainURL + '/contest/' + c + '/submission/' + u}')`);
		var nL = [];
		var curr = ctL.children().eq(1).find("a");
		curr.each(function(){
			var j = $("<div style='display:inline-block'></div>");
			if($(this).hasClass("user-gray"))			j.attr("class", "user-newbie");
			else if($(this).hasClass("user-green"))	j.attr("class", "user-pupil");
			else if($(this).hasClass("user-cyan"))	j.attr("class", "user-specialist");
			else if($(this).hasClass("user-blue"))	j.attr("class", "user-expert");
			else if($(this).hasClass("user-voilet"))	j.attr("class", "user-cmaster");
			else if($(this).hasClass("user-orange"))	j.attr("class", "user-master");
			else if($(this).hasClass("user-yellow"))	j.attr("class", "user-imaster");
			else if($(this).hasClass("user-red"))		j.attr("class", "user-grandmaster");
			else if($(this).hasClass("user-fire"))	j.attr("class", "user-igrandmaster");
			else if($(this).hasClass("user-legendary"))	j.attr("class", "user-legendary");
			else j.attr("class", "");
			j.html($(this).text());
			nL.push(j);
		});

		$(".submissionUsername").html("");
		if(nL.length == 1)	$(".submissionUsername").append(nL[0]);
		else{
			$(".submissionUsername").append(nL[0]);
			$(".submissionUsername").append(": ");
			for(var i=1; i<nL.length; i++){
				if(i != 1)	$(".submissionUsername").append(", ");
				$(".submissionUsername").append(nL[i]);
			}
		}
		if(data.find("#program-source-text").length == 0){
			$(".submissionCode").html(`<div style='position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center'><span info="errorCannotGetCode">${languageOption.error.errorCannotGetCode}</span></div>`);
		}
		else{
			$(".submissionCode").html(`<code>${allHtmlSpecialChars(data.find("#program-source-text").text())}</code>`);
			var q = data.find("#program-source-text").attr("class").split(" ");
			var lang = "plaintext";
			for(var p=0; p<q.length; p++){
				var i = q[p];
				if(i.substring(0, 4) == "lang")	lang = i.substring(5);
			}
			$(".submissionCode > code").attr("class", "hljs language-" + lang);
			hljs.highlightElement($(".submissionCode > code")[0]);
		}
	}
	$(".submissionCloser").unbind("click").click(function(){
		submissionLastOperated = new Date();
		$(".HtmlContainer > div > .loadingInterface").css("opacity", 0);
		setTimeout(function(){$(".HtmlContainer > div > .loadingInterface").css("display", "none");}, 500);
	})
	loader(req);
}
function getIdFromProblemName(x){
	var ret = "";
	
	for(var i=1; i<x.length; i++){
		if(x[i] == ")")	break;
		ret += x[i];
	}
	return ret;
}