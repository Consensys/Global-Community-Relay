# DeFi Transacts
DeFiTransacts is a platform where you can instantly start earning money through your Metamask account.

## Project Summary
DeFiTransacts is an attempt to solve the user adoption problem in DeFi. It is built on the top of most familiar wallet, Metamask. 

Users can install the plugin, and it will create a saving account in their metamask wallet. Whenever user want to invest their holdings into DeFi protocols, they can single click choose one of the recipes and our smart contracts will allocate the funds accordingly. To monitor their investments, they can check them even in their account. 
## Project Team
### Manank Patni
* Email :- manank321@gmail.com
* Address :- 0x4Db928f96c8b6581a79557B269D9AD35935D3601
* Is it okay to communicate furthur ? yes

### Sachin Mittal 
* Email :- sachin.narenmittal@gmail.com
* Address :- thesachinmittal.gitcoin.eth
* Is it okay to communicate furthur ? yes

## How to setup?
1. Start with building special fork of metamask along with our snap.
`cd metamask-snaps-beta
yarn install
yarn start`
2. Add custom build to Chrome
- Open Settings > Extensions.
- Check "Developer mode".
- Alternatively, use the URL chrome://extensions/ in your address bar
- At the top, click Load Unpacked Extension.
- Navigate to your custom or previous version metamask-plugin/dist/chrome folder.
- Click Select.
- Change to your locale via chrome://settings/languages
- Restart the browser and test the plugin in your locale
3. Install tools for building metamask snap by going to root directory of project and running following commands.
`cd snaps-cli
npm i -g snaps-cli`
4. Build metamask snap by executing following.
`cd examples/defi-transacts
mm-snap build
mm-snap serve`
5. Now Visit below url as prompted.
`http://localhost:8081` 

## Link to Ancillary Material
Pitch Deck: https://docs.google.com/presentation/d/1CB5SbJK7KNLEKlcc-aPhI5XHhGO_gewguDFheMAAU1Y/edit?usp=sharing

Video Demo: https://www.loom.com/share/fa9ab07c7dbc48f497b0c866fc5faeab



