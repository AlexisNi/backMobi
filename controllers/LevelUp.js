/**
 * Created by alex on 25/02/2017.
 */
module.exports=function (level,currentExperience) {
    var levelArray=[{level:1,nextLevel:300},
      {level:2,nextLevel:600},
      {level:3,nextLevel:900},
      {level:4,nextLevel:1200},
      {level:5,nextLevel:1500},
      {level:6,nextLevel:1800},
      {level:7,nextLevel:2100},
      {level:9,nextLevel:3000},
      {level:10,nextLevel:4000},
      {level:11,nextLevel:5000},
      {level:12,nextLevel:6000},
      {level:13,nextLevel:7000},
      {level:14,nextLevel:8000}]
    var levelInfo={level:level,currentExperience:currentExperience};
    if (levelInfo.currentExperience>levelArray[level-1].nextLevel){
        levelInfo.level++;
        levelInfo.currentExperience=levelInfo.currentExperience-levelArray[level-1].nextLevel;
    }
    return levelInfo;

}