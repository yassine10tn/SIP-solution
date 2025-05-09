import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'delivered' | 'read';
}

@Component({
  selector: 'app-assistant-virtual',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './assistant-virtual.component.html',
})
export class AssistantVirtualComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  userInput: string = '';
  messages: Message[] = [];
  isLoading: boolean = false;
  isOpen: boolean = false;
  isTyping: boolean = false;
  suggestedQuestions: string[] = [
    'Quel est le nombre de souscriptions de la société raison sociale 2 ?',
    'Qui est le commissaire aux comptes de la société raison sociale 2 ?',
    'Quels sont les contacts de la société raison sociale 2 ?',
    'Quel est le nombre de vente de la société raison sociale 2 ?',
  ];

  private apiUrl = 'http://localhost:8000/api/Chatbot/ask'; // Mise à jour du port

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.addBotMessage(
      'Bonjour ! Je suis votre assistant virtuel. Posez-moi vos questions ou choisissez une suggestion ci-dessous.'
    );
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput;
    this.addUserMessage(userMessage, 'sending');
    this.userInput = '';
    this.isLoading = true;

    setTimeout(() => {
      this.updateLastMessageStatus('delivered');
      this.isTyping = true;

      this.getBotResponse(userMessage).subscribe({
        next: (response: any) => {
          this.isTyping = false;
          this.isLoading = false;

          console.log('Réponse API:', response);

          let typedResponse = '';
          const fullResponse = response.response || 'Désolé, aucune réponse reçue du serveur.';
          const typingInterval = setInterval(() => {
            if (fullResponse.length > typedResponse.length) {
              typedResponse = fullResponse.substring(0, typedResponse.length + 1);
              if (this.messages[this.messages.length - 1].sender === 'bot') {
                this.messages[this.messages.length - 1].content = typedResponse;
              } else {
                this.addBotMessage(typedResponse);
              }
              this.scrollToBottom();
            } else {
              clearInterval(typingInterval);
              this.updateLastMessageStatus('read');
              setTimeout(() => {
                this.addBotMessage('Voulez-vous en savoir plus ou poser une autre question ?');
              }, 800);
            }
          }, 30);
        },
        error: (err) => {
          this.isTyping = false;
          this.isLoading = false;
          let errorMessage = 'Désolé, une erreur s\'est produite. Veuillez réessayer.';
          if (err.error && err.error.response) {
            errorMessage = err.error.response;
          }
          this.addBotMessage(errorMessage);
          console.error('Erreur API:', err);
        },
      });
    }, 500);
  }

  selectSuggestion(question: string): void {
    this.userInput = question;
    this.sendMessage();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private addUserMessage(content: string, status: 'sending' | 'delivered' = 'delivered'): void {
    this.messages.push({
      content,
      sender: 'user',
      timestamp: new Date(),
      status,
    });
  }

  private addBotMessage(content: string): void {
    this.messages.push({
      content,
      sender: 'bot',
      timestamp: new Date(),
    });
    this.scrollToBottom();
  }

  private updateLastMessageStatus(status: 'delivered' | 'read'): void {
    const lastUserMessage = this.messages
      .slice()
      .reverse()
      .find((m) => m.sender === 'user');

    if (lastUserMessage) {
      lastUserMessage.status = status;
    }
  }

  private getBotResponse(userMessage: string) {
    return this.http.post(this.apiUrl, { question: userMessage });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}