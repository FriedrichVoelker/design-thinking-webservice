#include <VarSpeedServo.h>
VarSpeedServo myservo;
VarSpeedServo servo2;

int servospeed = 30;

void setup() {  
  Serial.begin(9600);
  Serial.println("-----------------------");
  Serial.println("Starting");
  Serial.println(" ");
  Serial.println("-----------------------");
  myservo.attach(8);
  servo2.attach(7);
  myservo.slowmove(90, servospeed);
//  servo2.slowmove(0, servospeed);
  delay(1000);
}

void loop() {
  readVal(analogRead(A1), "A1");
  readVal(analogRead(A2), "A2");
  readVal(analogRead(A3), "A3");
  readVal(analogRead(A4), "A4");

  checkHighest(analogRead(A1), analogRead(A2), analogRead(A3), analogRead(A4));
  
  delay(1000);
}

int getmax(int x, int y){
    if(x > y){
        return x;
    }else{
        return y;
    }
}

void checkHighest(const int a1,const int a2,const int a3,const int a4){

  int highest = 0;
  int second = 0;

  int firsthigh = getmax(a1, a2);
  int secondhigh = getmax(a3, a4);

  highest = getmax(firsthigh, secondhigh);

  highest == firsthigh ? second = secondhigh : second = firsthigh;
  
//  Serial.print("Highest: ");
//  Serial.print(highest);
//  Serial.print(" Second highest: ");
//  Serial.println(second);


  int angle = 0;
  
  int diff = highest - second;
  diff *= 0.9;

  if(diff <= 0){
    diff = 0;
  }
  Serial.println(diff);
  
  boolean a1turn = false;
  
  if(highest == a1){
      Serial.print("High Port: A1");
      angle = 90;
      if(second == a2){
        
      }else if(second == a3){
        angle = getRotation(a3, highest, 180, true);
        if(angle > 90){
          angle = 90;
        }
      }else if(second == a4){
        angle = getRotation(a4, highest, 90, true);
        angle += diff;
        if(angle < 90){
          angle = 90;
        }
      }

       a1turn = true;
      
  }else if(highest == a2){
      Serial.print("High Port: A2");
      angle = 90;

      if(second == a1){
        
      }else if(second == a3){
        angle = getRotation(a3, highest, 90, false);
        if(angle < 90){
          angle = 90;
        }
      }else if(second == a4){
        angle = getRotation(a4, highest, 180, false);
        if(angle > 90){
          angle = 90;
        }
      }
      
  }else if(highest == a3){
      Serial.print("High Port: A3");
       angle = 0;

      if(second == a1){
        
      }else if(second == a2){
        angle = getRotation(highest, a2, 90, false);
        angle -= diff;
        if(angle > 90){
          angle = 90;
        }
      }else if(second == a4){
        angle = 90;
      }


             
   }else if(highest == a4){
      Serial.print("High Port: A4");
      
      angle = 180;

      if(second == a1){
        
      }else if(second == a2){
        angle = getRotation(highest, a2, 180, false);
        angle += diff;
        if(angle < 90){
          angle = 90;
        }
      }else if(second == a3){
        angle = 90;
      }
  }

  

  
  if(a1turn){
    servo2.slowmove(90, 30);
  }else{
    servo2.slowmove(0, 30);
  }

  if(angle >= 180){
    angle = 180;
  }

  
  Serial.print(" Angle: ");
  Serial.println(angle);
  myservo.slowmove(angle, servospeed);
}


int maxCap = 550;

int getRotation(int lowerDegree, int higherDegree, int degree, boolean flipme){

  if(lowerDegree == higherDegree){
    return degree - 45;
  }
  
  Serial.println("");
  Serial.print(lowerDegree);
  Serial.print(" ");
  Serial.print(higherDegree);
  Serial.print(" ");
  Serial.println(degree);

  
  if(higherDegree > maxCap){
    higherDegree = maxCap;
  }
  if(lowerDegree > maxCap) {
    lowerDegree = maxCap;
  }
  int tempvar =((45 * ((lowerDegree - higherDegree) / maxCap)));
  
   if(degree == 180 && !flipme){
    tempvar += 45;
   }else if(!flipme){
    tempvar -= 45;
   }else{
    tempvar += 45;
   }
  
  Serial.println(tempvar);
  tempvar = 90 + tempvar;

  
  
  return tempvar;
}


int getfrRotation(int lower, int higher, int deg){
  int lowdeg = deg - 90;

  if(higher > lower){
    int drei1 = higher / 100;
  }
  


  
}


void readVal(int value, String port){
     Serial.print("Value: ");
     Serial.print(value);
     Serial.println(" on Port: " + port);
}
