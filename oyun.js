// Canvas elementini oluşturuyorum
var c = document.createElement("canvas");
c.width = window.innerWidth; // Canvas genişliğini pencere genişliği olarak ayarlıyorum
c.height = window.innerHeight; // Canvas yüksekliğini pencere yüksekliği olarak ayarlıyorum
document.body.appendChild(c); // Canvas elementini HTML sayfasına ekliyorum
var ctx = c.getContext("2d"); // 2D çizim context'ini alıyorum

var array = [];
while (array.length < 254) { // 254 elemanlı bir dizi oluşturmak için döngü başlatıyorum
  while (array.includes(val = Math.floor(Math.random() * 255))); // 0-254 arası rastgele tam sayıları diziye ekliyorum
  array.push(val); // Rastgele tam sayıyı diziye ekliyorum
}
array.push(array[0]); // Dizinin sonuna ilk elemanı tekrar ekliyorum (kapalı bir şekil oluşturmak için)

console.table(val);

// Lineer interpolasyon fonksiyonunu tanımlıyorum
var lerp = (a, b, j) => a + (b - a) * (1 - Math.cos(j * Math.PI)) / 2;

// Eğri fonksiyonunu tanımlıyorum
var curve = x => {
  x = (x + player.x) * 0.01 % 254; // Player'ın konumunu da ekleyerek eğriyi oluştur
  return lerp(array[Math.floor(x)], array[Math.ceil(x)], x - Math.floor(x)); // Lineer interpolasyon ile eğriyi oluşturuyorum
}


// Arka plan, ön plan ve çizgi renklerini tanımlıyorum
var bgcolor = "#9BB0C1"; 
var forecolor = "#F1EF99";
var linecolor = "#D37676";
var linewidth = 8; // Çizgi kalınlığını ayarlıyorum
var offset = -10; // Canvas kenarlarından uzaklık (margin) ayarını ayarlıyorum
var yrate= .3; //yRatio
var j = 0; // Adım sayacı
var speed=0; // Hız değişkeni oluşturdum
var score = 0; // Puan değişkeni oluşturdum
var gameStarted = false; // Oyunun başladığını takip etmek için değişken oluşturdum

// Player'ı tanımlıyorum
var player = new function (){
  this.x = 50; // Sayfanın en başından 50px uzaklıkta başlat
  this.y = 50;
  this.truck = new Image();
  this.truck.src = "oyun.png";
  this.r = 0;
  this.tSpeed = 0;
  this.jSpeed = 0;
  this.draw = function(){
     // Yolun eğriliğine göre oyuncunun konumunu hesaplıyorum
    var h1 = (c.height * .9) - curve(this.x + j) * yrate; 
    var h2 = (c.height * .9) - curve(this.x + j + 5) * yrate;
    // Oyuncunun görüntüsünü çiziyorum
    var gnd = 0;
    if(h1 - 40 > this.y){
      this.tSpeed += 0.1;

    }
    else {
      this.tSpeed -= this.y - (h1 - 40);
      this.y = h1 -40;
      gnd = 1 ;
    }

    this.y = h1 - 40;

    var angle = Math.atan2((h2 - 40) - this.y, (this.x * 5) - this.x);
    if(gnd){
      this.r -= (this.r - angle) * 0.5;
      this.jSpeed = this.tSpeed - (angle - this.rot);

    }

    this.r -= this.jSpeed * .1;

    if(this.r > Math.PI) this.r = -Math.PI;
    if(this.r < -Math.PI) this.r = Math.PI;


    this.y += this.tSpeed;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r)
    ctx.drawImage(this.truck, -40, -40, 80, 80);
    ctx.restore();

  }
}


// Monster fonksiyonunu tanımlıyorum
function Monster() {
  this.x = Math.random() * c.width + player.x + 50; // Rastgele x konumu, playerın önünde
  this.y = 50;
  this.truck = new Image();
  this.truck.src = "monster.png";
  this.r = 0;
  this.tSpeed = 0;
  this.jSpeed = 0;
  this.passed = false; // Canavarın geçilip geçilmediğini kontrol etmek için değişken oluşturdum
}

// Monster fonksiyonunun prototipine draw metodu ekliyorum
Monster.prototype.draw = function() {   // Canavarın pozisyonu ve görüntüsünü çiziyorum
  var h1 = (c.height * .9) - curve(this.x + j) * yrate;
  var h2 = (c.height * .9) - curve(this.x + j + 5) * yrate;

  var gnd = 0;
  if (h1 - 40 > this.y) {
      this.tSpeed += 0.1;
  } else {
      this.tSpeed -= this.y - (h1 - 40);
      this.y = h1 - 40;
      gnd = 1;
  }

  this.y = h1 - 40;

  var angle = Math.atan2((h2 - 40) - this.y, (this.x * 5) - this.x);
  if (gnd) {
      this.r -= (this.r - angle) * 0.5;
      this.jSpeed = this.tSpeed - (angle - this.rot);
  }

  this.r -= this.jSpeed * .1;

  if (this.r > Math.PI) this.r = -Math.PI;
  if (this.r < -Math.PI) this.r = Math.PI;

  this.y += this.tSpeed;
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.r)
  ctx.drawImage(this.truck, -40, -40, 80, 80);
  ctx.restore();

}

// monsters dizisini tanımlıyorum
var monsters = [];

function startGame() {  // Oyun başladığında canavarların oluşturulması ve eklenmesi sağlanır

  gameStarted = true;
  setInterval(function() {
    var newMonster = new Monster(); // Yeni bir canavar oluştur
    var lastMonster = monsters[monsters.length - 1]; // Son eklenen canavarı al
    
    // Eğer son canavar yoksa veya son canavardan minimum 10  piksel uzaklıkta ise
    if (!lastMonster || (newMonster.x - lastMonster.x) >= 10) {
      // Oyun alanına yeni canavarı ekle
      monsters.push(newMonster);
    }
  }, 5000); // 5 saniyede bir yeni canavar oluştur
}





// Çizim fonksiyonunu tanımlıyorum
function draw() {   // Oyunun çizim işlemleri gerçekleştirilir
  if (!gameStarted) {
    startGame();
  }
  speed -= (speed-1)*0.01;
  j += 5 * speed; // Adım sayacını arttırıyorum
  
  ctx.fillStyle = bgcolor; // Arka plan rengini belirliyorum
  ctx.fillRect(0, 0, c.width, c.height); // Arka planı boyuyorum

  // Player'ı çiz
  player.draw();

  ctx.fillStyle = forecolor; // Ön plan rengini belirliyorum
  ctx.strokeStyle = linecolor; // Çizgi rengini belirliyorum
  ctx.lineWidth = linewidth; // Çizgi kalınlığını ayarlıyorum
  ctx.beginPath(); // Yeni bir çizim yolu başlatıyorum
  ctx.moveTo(offset, c.height - offset); // Başlangıç noktasını belirliyorum

  for (let k = offset; k < c.width - offset; ++k) { // Canvas genişliği boyunca döngü başlatıyorum
    ctx.lineTo(k, (c.height * .9) - curve(k + j) * yrate); // Eğriyi çiziyorum
  }

  ctx.lineTo(c.width - offset, c.height - offset); // Kapalı bir şekil oluşturmak için son noktayı ekliyorum
  ctx.closePath(); // Çizgi yolu kapatıyorum
  ctx.fill(); // Şekli dolduruyoruz
  ctx.stroke(); // Şekli çiziyorum

  // Canavarları çiz
  for (var i = 0; i < monsters.length; i++) {
    monsters[i].draw();
    if (player.x > monsters[i].x && !monsters[i].passed) {
      monsters[i].passed = true;
      score += 25; // Canavarı geçtiğimizde 25 puan ekleyelim
    }
    // Player'ın canavara çarpıp çarpmadığını kontrol et
    if (player.x < monsters[i].x + 80 && player.x + 80 > monsters[i].x &&
        player.y < monsters[i].y + 80 && player.y + 80 > monsters[i].y) {
      gameOver();
    }
  }

  // Skoru ekrana yazdır
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(draw); // Animasyon çerçevesini güncelliyorum
}

// Play düğmesini oluştur
var playButton = document.createElement("button");
playButton.textContent = "Play";
playButton.style.position = "absolute";
playButton.style.top = "50%";
playButton.style.left = "50%";
playButton.style.transform = "translate(-50%, -50%)";
playButton.style.padding = "15px 30px";
playButton.style.fontSize = "20px";
playButton.style.backgroundColor = "#4CAF50";
playButton.style.color = "white";
playButton.style.border = "none";
playButton.style.borderRadius = "8px";
document.body.appendChild(playButton);

// Play düğmesine tıklama olayını ekle
playButton.addEventListener("click", function() {
  playButton.style.display = "none"; // Play düğmesini gizle
  draw(); // Oyunu başlat
});



document.addEventListener('keydown', function(event) {
  if(event.key == 'ArrowRight') {
      // Sağ ok tuşuna basıldığında player'ı ileriye hareket ettir
      player.x += 10;
  } 
  else if(event.key === 'ArrowUp') {
    function createJumpingPlayer(monsterX, monsterY, playerX, playerY) {
      // Canavarın yüksekliği
      var monsterHeight = monsterY;
    
      // Player'ın yüksekliğini canavardan biraz daha yukarıda başlat
      var playerHeight = monsterHeight - 10; // Örnek olarak 50 piksel yukarıda başlatıyorum
    
      // Oluşturulan player'ın konumunu ve yüksekliğini döndür
      return { x: playerX, y: playerHeight };
    }
    // Yukarı ok tuşuna basıldığında player'ı yukarı zıplat
    var playerJumpHeight = monsterY - playerY + 10; // Canavardan en az 100 piksel daha yukarıya zıplat
    playerJump(playerJumpHeight);

// Player'ı belirtilen yüksekliğe zıplatma fonksiyonu
function playerJump(jumpHeight) {
  // Player'ın yukarı zıplama hızını canavarın yüksekliğine bağlı olarak ayarla
  player.jSpeed = -Math.sqrt(2 * 9.81 * jumpHeight); // Yükseklikten bağımsız olarak sabit bir ivme kullanarak zıplat
}

// Canavarın yüksekliği ve player'ın yüksekliği ile birlikte createJumpingPlayer fonksiyonunu çağırarak player'ı oluştur
var playerStartPosition = createJumpingPlayer(monsterX, monsterY, playerX, playerY);

}
   else if (event.key === 'ArrowLeft') {
      // Sol ok tuşuna basıldığında player'ı geriye hareket ettir
      player.x -= 10; // veya başka bir değer
    }

    else if ((event.ctrlKey || event.metaKey) && event.key === '4') { // Ctrl + S veya Command + S tuş kombinasyonu kontrolü
      speed += .5; // Belirli bir hızlanma miktarıyla hızı arttır
    }
    else if ((event.ctrlKey || event.metaKey) && event.key === 'ı') { // Ctrl + ı veya Command + ı
      // Hava da asılı kalma
      player.jumpTimer = 5; // Zıplama zamanlayıcısını ayarla
    }

  });


  function gameOver() {
    ctx.fillStyle = "#000";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", c.width/2 - 120, c.height/2);
  
    // Yeniden başlamak için sayfayı yenileme talimatını yazdır
    ctx.font = "24px Arial";
    ctx.fillText("Yeniden başlamak için sayfayı yenileyiniz.", c.width/2 - 200, c.height/2 + 50);
  
    cancelAnimationFrame(animationFrameId); // Oyunu durdur
  }

  setInterval(updateJump, 1000 / 60);
