import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';


@Component({
  selector: 'app-image-modal',
  template: `
    <div class="modal-overlay" (click)="closeModal.emit()"></div>
    <div class="modal-container" [@modalAnimation]>

      <div class="button prev" (click)="prevImage()">
        <mat-icon style="transform: scale(1.5);">navigate_before</mat-icon>
      </div>
      
      <img [src]="'/assets/galerie/' + images[index].name" alt="Expanded Image">

      <div class="button next" (click)="nextImage()">
        <mat-icon style="transform: scale(1.5);">navigate_next</mat-icon>
      </div>

    </div>
  `,
  styleUrls: ['./image-modal.component.css'],
  animations: [
    trigger('modalAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [
        animate('200ms ease-in-out', keyframes([
          style({ opacity: 0, transform: 'scale(0.95)', offset: 0 }),
          style({ opacity: 0.5, transform: 'scale(1.01)', offset: 0.5 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class ImageModalComponent {
  @Input() images: any[] = [];
  @Input() index: number = 0;
  @Output() closeModal = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'ArrowLeft':
        this.prevImage();
        break;
      case 'Escape':
        this.closeModal.emit();
        break;
    }
  }

  nextImage() {
    this.index = (this.index + 1) % this.images.length;
  }
  prevImage() {
    this.index = (this.index - 1 + this.images.length) % this.images.length;
  }
}

@Component({
  selector: 'app-galerie',
  templateUrl: './galerie.component.html',
  styleUrls: ['./galerie.component.css']
})
export class GalerieComponent {
  imageData = [
    {
      name: '1.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '2.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '3.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '4.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '5.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '6.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '7.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '8.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '9.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '10.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '11.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '12.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '13.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '14.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '15.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '16.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '17.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '18.jpg',
      description: '',
      expanded: false
    }, 
    {
      name: '19.jpg',
      description: '',
      expanded: false
    }
  ];
  
  selectedImage: number | null = null;
  openModal(image: any) {
    this.selectedImage = this.imageData.indexOf(image);
  }
  closeModal() {
    this.selectedImage = null;
  }
}
