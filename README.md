# CodeLoverBot

Un BOT para nuestro grupo de Telegram CodeLovers.

### Como le agrego nuevos comandos?

#### Documentacion de la api para el bot

https://github.com/yagop/node-telegram-bot-api

#### Documentacion api de telegram 

https://core.telegram.org/bots/api

Solo tienes que modificar el `index.js` con el comando que quieras añadir:

```
bot.onText(/\/question (.+)/, function(msg, match) {
  var chatId = msg.chat.id;
  // match[1] sera el grupo de la regex dentro de los parentesis
  // ej: si alguien escribe "/question hola", entonces match[1] sera igual a "hola"
  var receivedText = match[1]; 

  bot.sendMessage(chatId, "Hola mundo");
});
```

### requirements

- Node.js
- NPM

### LICENSE

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
