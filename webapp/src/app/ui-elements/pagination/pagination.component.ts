import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

	@Input() startIndex: number;
	@Input() pageSize: number;
	@Input() totalRecords: number;

	@Output() onPageChange: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild("pageNumber", { static: false }) pageNumberInput: ElementRef;

	enableGotoPageMode: boolean = false;
	lastFocusIn: EventTarget;
	pages = [];
	currentPage: number = 1;
	numberOfPages: number;

	constructor() { }

	ngOnChanges(): void {
		this.currentPage = (this.startIndex / this.pageSize) + 1;
		this.pages = [];
		this.numberOfPages = Math.ceil(this.totalRecords / this.pageSize);

		if (this.currentPage > this.numberOfPages) {
			this.currentPage = 1;
		}

		for (let i = 1; i <= this.numberOfPages; i++) {
			if (i >= this.currentPage - 2 && i <= this.currentPage + 2) {
				this.pages.push(i);
			}
		}
	}

	ngOnInit(): void {
	}

	/**
	 * Triggers when a page changed.
	 * @param page 
	 * 
	 * @returns void
	 */
	pageChange(page: number): void {
		let index = page == 1 ? 0 : (page - 1) * this.pageSize;
		this.onPageChange.emit(index);
		this.currentPage = page;
		this.enableGotoPageMode = false;
	}

	/**
	 * Capture page number.
	 * 
	 * @returns void
	 */
	capturePageNumber(): void {
		this.enableGotoPageMode = true;
		setTimeout(() => {
			this.pageNumberInput.nativeElement.focus();
		}, 100);
	}

	/**
	 * Triggers when a page entered.
	 * @param page: number 
	 * 
	 * @returns void
	 */
	pageNumerEnter(page: number): void {
		if (page < 1 || page > this.numberOfPages) {
			this.currentPage = 1;
		}
	}

	/**
	 * Triggers when a page changed by key press.
	 * @param eve:KeyboardEvent
	 * 
	 * @returns boolean
	 */
	numberBoxKeyPress(eve: KeyboardEvent): boolean | void {
		if (eve.keyCode == 13) {
			eve.stopPropagation();
			eve.preventDefault();
			eve.stopImmediatePropagation();
			eve.cancelBubble = true;
			this.pageChange(this.currentPage);
			return false;
		}
	}

	/**
	 * Triggers when focused.
	 * @param eve:FocusEvent
	 * 
	 * @returns void
	 */
	@HostListener('focus', ['$event'])
	onFocus(eve: FocusEvent): void {
		this.lastFocusIn = eve.relatedTarget;
	}

}
