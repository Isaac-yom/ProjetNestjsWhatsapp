import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { resolve } from 'path';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;

  onModuleInit() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    }); 

    this.client.on('qr', (qr) => {
      console.log('Scan ce Code QR avec ton téléphone: ');
      qrcode.generate(qr, { small:true });
    });

    this.client.on('ready', () => {
      console.log('Whatsapp est pret à envoyer et recevoir des messages');
    });

    this.client.on('message', async (message) => {
      console.log(`Message reçu de ${message.from}: ${message.body}`);

      // LES MESSAGES AUTOMATIQUES
      
      const message1 = [
        "Bienvenue chez *Yom Service*.",
        "",
        "Faites un tour sur https://yomservice.com et accédez à *nos services* (Location, Vente, Conseils immobiliers...).",
        "",
        "*Notre siège*: Calavi Finanfa, von clinique HOREB, en face du second portail de l'EPP Finanfa, et à 1 minute de l'école BAKITHA.",
        "",
        "De quels *Services immobiliers* avez-vous besoin ?"
      ].join("\n");

      const message2 = [
        "Vous pouvez nous suivre et nous contacter facilement via les liens ci-dessous:",
        "",
        "*Site Web*: https://yomservice.com",
        "*WhatsApp*: https://wa.me/22961524582",
        "*Facebook*: facebook.com/YomService",
        "*Tiktok*: https://vm.tiktok.com/ZMrHnpCWG/",
        "*Instagram*: https://www.instagram.com/serviceyom?igsh=cjZwcnViOXZsNTU4",
        "*X (ex Twitter)*: https://x.com/YomService?t=1h4WgXt-11eCIm1GynOPbg&s=09",
        "*LinkedIn*: https://www.linkedin.com/company/yom-service/",
        "*Telegram*: t.me/Yomservice"
      ].join("\n");


      await message.reply(message1)

      await new Promise(resolve => setTimeout(resolve, 1000))

      await this.client.sendMessage(message.from, message2);

      if(message.body.toLowerCase() === 'ping') {
        await message.reply('Pong');
      }
    }); 

    this.client.initialize();
  }

  async sendMessage(phoneNumber: string, text: string) {
    const number = phoneNumber.includes('@c.us') ? phoneNumber : `${ phoneNumber }@c.us`;
    await this.client.sendMessage(number, text);
  }
}