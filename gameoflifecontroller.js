angular.module('app').controller('gameoflifeController', function($scope){
  var canvas = document.getElementById('game-of-life-canvas');
  var context = canvas.getContext('2d');

  $scope.frameCount = 0;
  $scope.aliveChar = '0';
  $scope.gridSize = 10;
  $scope.speed = 20;
  $scope.matrix = {
    'columns': Math.round((window.innerWidth -20) / 10,0),
    'rows' :  Math.round((window.innerHeight -40) / 20,0),
    'initialPopulation' : 10
  };
  $scope.initialState;

  function Point(x,y){
    this.x = x;
    this.y = y;
  }
  
  // Note: survival is worse as underpopulation goes up
  $scope.races = [
    {underpopulation: 2, reproduction: 3, overpopulation: 4, damage: 0, colour: "lightblue"},
    {underpopulation: 2, reproduction: 3, overpopulation: 4, damage: 1, colour: "yellow"},
    {underpopulation: 2, reproduction: 3, overpopulation: 4, damage: 1, colour: "red"},
    //{underpopulation: 3, reproduction: 4, overpopulation: 5, damage: 4, colour: "red"},
    //{underpopulation: 4, reproduction: 5, overpopulation: 6, damage: 20, colour: "grey"},
  ];

  $scope.possibleNeighbours =[
            new Point(-1, 0), // 1st neighbour (-1, 0)
            new Point(-1, 1), // 2nd neighbour (-1, 1)
            new Point( 0, 1), // 3rd neighbour ( 0, 1)
            new Point( 1, 1), // 4th neighbour ( 1, 1)
            new Point( 1, 0), // 5th neighbour ( 1, 0)
            new Point( 1,-1), // 6th neighbour ( 1,-1)
            new Point( 0,-1), // 7th neighbour ( 0,-1)
            new Point(-1,-1),]; // 8th neighbour (-1,-1)

  $scope.getNextState = function(cells){
     var nextState = angular.copy(cells);

     for (var i = 0; i < cells.length; i++){
       for (var j=0; j <cells[0].length; j++){
          var cellRaceIndex = cells[i][j] - 1;
          var cellRace = $scope.races[cellRaceIndex];
          
                  var livingNeighbours = [];
                  
                  for(var r = 0; r < $scope.races.length; r++){
                    livingNeighbours.push(0);
                  }

          for(var k = 0; k < $scope.possibleNeighbours.length; k++){
            var possibleLife = $scope.possibleNeighbours[k];

            if (!!cells[i +possibleLife.x ] && !!cells[i +possibleLife.x][j+possibleLife.y]){
              
              if (cells[i +possibleLife.x][j+possibleLife.y] > 0)
                livingNeighbours[cells[i +possibleLife.x][j+possibleLife.y] - 1]++;
            }
          }
          
          // standard reproduce
          for(var r = 0; r < $scope.races.length; r++){
            var tempRace = $scope.races[r];
            if (cells[i][j] == 0 && livingNeighbours[r] >= tempRace.reproduction && livingNeighbours[r] < tempRace.overpopulation)
            {
                nextState[i][j] = r + 1;
            }
          }
          
          // standard death
          if (cellRaceIndex > -1 && (livingNeighbours[cellRaceIndex] < cellRace.underpopulation || livingNeighbours[cellRaceIndex] >= cellRace.overpopulation))
          {
            nextState[i][j] = 0;
          }
          
          
          // war
          if(cells[i][j] > 0){
            var maxScore = 0;
            var maxR;
            for(var r = 0; r < $scope.races.length; r++){
              if( r != cellRaceIndex ){
                var tempRace = $scope.races[r];
                var score = livingNeighbours[r] * tempRace.damage;
                if(score > maxScore){
                  maxScore = score;
                  maxR = r;
                }
              }
            }
            if(maxR != undefined && ((cellRace.damage * livingNeighbours[cellRaceIndex]) < maxScore)){
              nextState[i][j] = maxR + 1;
            }
          }
          
       }
     }

     return nextState;
  }

  $scope.getNewState = function(){
    var newState = new Array();

    for (var i = 0; i < $scope.matrix.columns ; i ++){
      newState.push(new Array());

      for (var j=0 ; j <$scope.matrix.rows; j++){
          newState[i].push((Math.random() * 100 <= $scope.matrix.initialPopulation ? Math.ceil(Math.random() * $scope.races.length) : 0));
      }
    }
    return newState;
  }

  $scope.draw = function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    if (!$scope.matrix.cells)
      return;

    for (var i = 0; i < $scope.matrix.cells.length; i++){
      for (var j=0; j <$scope.matrix.cells[0].length; j++){
         $scope.drawCell($scope.matrix.cells[i][j]);
         context.translate(0,$scope.gridSize);
      }
      context.translate($scope.gridSize,-($scope.matrix.cells[0].length * $scope.gridSize));
    }
    context.restore();
  }

  $scope.drawCell = function(cell){
    if (cell > 0){
      context.strokeStyle = $scope.races[cell - 1].colour;
      context.beginPath();
      context.arc(($scope.gridSize/2),($scope.gridSize/2),($scope.gridSize/2.5),0,2 * Math.PI);
      context.stroke();
    }
  }

  $scope.initState = function(){
    $scope.matrix.cells = $scope.getNewState();
    $scope.initialState = angular.copy($scope.matrix.cells);
    canvas.height = $scope.matrix.rows * $scope.gridSize;
    canvas.width = $scope.matrix.columns * $scope.gridSize;
  }

  $scope.restart = function(){
    $scope.matrix.cells = angular.copy($scope.initialState);
  }

  $scope.updateState = function(){
    $scope.matrix.cells = $scope.getNextState($scope.matrix.cells);
  };

  function animate() {
    if ($scope.speed < 20 && (parseInt($scope.speed) + $scope.frameCount) < 20 ){
      $scope.frameCount++;
    }
      else
    {
      $scope.updateState();
      $scope.draw();
      $scope.frameCount = 0;
    }
    requestAnimFrame(animate);
  }

  $scope.initState();
  $scope.draw();
  requestAnimFrame(animate);

});
