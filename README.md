# hyper-chess
Chess, but more.

## To build hyperchess_model
```
cd hyperchess_model
npm install
npm run build
```

## To run the front_end
```
cd hyperchess_model
npm link
cd ..
cd front_end
npm install
npm link hyperchess_model
npm start
```

## To run the Backend
```
cd hyperchess_model
npm link
cd ..
cd back_end
npm install
npm link hyperchess_model
node server.js
```
