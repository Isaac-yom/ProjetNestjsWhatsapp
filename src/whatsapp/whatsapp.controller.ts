import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}


  @Post('send') 
  async sendMessage(@Body() body: { number: string; message: string }) {
    await this.whatsappService.sendMessage(body.number, body.message);
    return { statut: 'Message envoyé' };
  }
}
