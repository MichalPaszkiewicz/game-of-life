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
          var livingNieghbours = 0;

          for(var k = 0; k < $scope.possibleNeighbours.length; k++){
            var possibleLife = $scope.possibleNeighbours[k];

            if (!!cells[i +possibleLife.x ] && !!cells[i +possibleLife.x][j+possibleLife.y]){
              if (cells[i +possibleLife.x][j+possibleLife.y] == 1)
                livingNieghbours++;
            }
          }
          if (cells[i][j] == 0 && livingNieghbours == 3)
          {
              nextState[i][j] = 1;
          }
          else if (cells[i][j] == 1 && (livingNieghbours < 2 || livingNieghbours > 3))
          {
              nextState[i][j] = 0;
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
          newState[i].push((Math.random() * 100 <= $scope.matrix.initialPopulation ? 1 : 0));
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
    if (cell === 1){
      context.strokeStyle = '#fff';
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
