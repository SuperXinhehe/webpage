#!/usr/bin/python
import urllib
import json as simplejson
from sys import stdin

usrname = stdin.readline()

usrname = str(usrname)
print(usrname)
## function input a league of legends username and output the id of the user
## otherwise return "no usrname found"

def getID(usrname):
	url1 = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/"+usrname+"?api_key=6cf7f511-51c1-41ae-8a2d-7411063a4fe7"
	response = urllib.urlopen(url1)
	data = simplejson.loads(response.read())
	usrname2 = usrname.lower()
	try:
		usrid = data[usrname2]["id"]
	except KeyError, e:
		usrid = "No such User"
	return(str(usrid))


# this function get the information about current game and 
# his counter team 
# get their summoner id and 
def getCurrentGame(usrname):
	usrid = getID(usrname)
	url2 = "https://na.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/NA1/"+usrid+"?api_key=6cf7f511-51c1-41ae-8a2d-7411063a4fe7"
	response = urllib.urlopen(url2)
	data = simplejson.loads(response.read())
	players = list()
	for par in data["participants"]:
		players.append([par["summonerId"],par["summonerName"],par["championId"]])
	return(players)

players = getCurrentGame(usrname)
## for those players I want to know if they are good at this certain champion :
## the winning rate and time they played in their ranked game
def getWinRate(players):
	out = list()
	length = 0
	for p in players:
		counter = 0
		usrid, usrname, championId = str(p[0]), str(p[1]), str(p[2])
		url3 = "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/"+usrid+"?championIds="+championId+"&rankedQueues=RANKED_SOLO_5x5&api_key=6cf7f511-51c1-41ae-8a2d-7411063a4fe7"
		response = urllib.urlopen(url3)
		data = simplejson.loads(response.read())
		try:
			matches = data["matches"]
			for m in matches:
				if m["participants"][0]["stats"]["winner"] == True:
					counter = counter + 1
			## rate for good at
			length = len(matches) 
			rate = counter/float(length)
		except KeyError,e:
			rate = "na"
		out.append([usrname,rate,length])
	return(out)

print(getWinRate(players))
