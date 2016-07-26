/**
 * Created by strukov on 7/21/16.
 */
import {Component, OnInit,  forwardRef, Inject} from "@angular/core"
import {Slope} from "../domain/Slope";
import {HTTP_PROVIDERS} from "@angular/http";
import {SlopeService} from "../service/SlopeService";
import {LiftService} from "../service/LiftService";
import {Lift} from "../domain/Lift";
import {TabDirective} from "./tab.directive";
import {TabsDirective} from "./tabs.directive";
import {ModalDirective} from "./modal.directive";
import {MapComponent} from "../map.component";
import {ClickedElementListener} from "../utils/ClickedElementListener";
import {ItemType} from "../enums/ItemType";

@Component({
    selector: 'left-menu',
    templateUrl: 'app/blocks/menu_left.html',
    styleUrls: ['app/blocks/menu_left_style.css'],
    providers: [SlopeService, LiftService, HTTP_PROVIDERS],
    directives:[TabDirective, TabsDirective, ModalDirective]
})

export class MenuDirective extends ClickedElementListener implements OnInit{

    myLifts: Array<Lift>;
    mySlopes: Array<Slope>;
    myIds: Array<string>;

    public itemType = ItemType;

    constructor(private slopeService:SlopeService, private liftService:LiftService,
                @Inject(forwardRef(() => MapComponent)) private map:MapComponent){
        super();
    }

    ngOnInit() {
        this.getSpecificItems();
    }

    getSpecificIds(ids:Array<string>){
        this.myIds = ids;
    }

    private getSpecificItems(){
        this.liftService.getSpecificLifts(this.myIds).subscribe(data => this.myLifts= data);
        this.slopeService.getSpecificSlopes(this.myIds).subscribe(data => this.mySlopes = data);

    }

    getItemModal(event: MouseEvent, item:ItemType){
        this.map.modal.getItemById(this.getModal(event).id, item);
    }


    private getModal(event: MouseEvent){
        var menuItem = document.getElementById(this.getClickedElementId(event));
        for(var i = 0; i < this.map.getIdsFromMap().length; i++){
            if(this.map.getIdsFromMap()[i] == menuItem.id) {
                var mapItem = this.map.getMapDocument().item(i);
                console.log(mapItem);
                var coordinates = mapItem.getAttribute('d');

                var mapItemLeftPattern = /\S+(?=,)/;

                var mapItemTopPattern = /(?=.*),.*/;
                var mapItemTopPattern2 = /[^,]+/;


                var mapItemTopFirstRegExp = coordinates.match(mapItemTopPattern).toString();
                var mapItemTop :any= mapItemTopFirstRegExp.match(mapItemTopPattern2);
                var mapItemLeft :any= coordinates.match(mapItemLeftPattern);

                console.log('Left: ' + mapItemLeft);
                console.log('Top: ' + mapItemTop);

                this.map.modal.elementX = mapItemLeft - 20;
                this.map.modal.elementY = mapItemTop -20;
            }
        }
        return menuItem;
    }
}