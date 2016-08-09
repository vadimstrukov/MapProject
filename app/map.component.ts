/**
 * Created by strukov on 7/19/16.
 */
import {Component, ViewChild, OnInit} from "@angular/core";
import {ModalDirective} from "./directives/modal.directive";
import {MenuDirective} from "./directives/menu.directive";
import {ClickedElementListener} from "./utils/ClickedElementListener";
import {ItemType} from "./enums/ItemType";
declare var svgPanZoom:any;

@Component({
  selector: 'map-lines',
  templateUrl:'app/blocks/map_lines.html',
  styleUrls: ['app/blocks/map_lines_style.css'],
  directives: [ModalDirective, MenuDirective]
})

export class MapComponent  implements OnInit{


    @ViewChild('modal') modal :ModalDirective;
    @ViewChild('left_menu') menu :MenuDirective;
    public itemType = ItemType;

    constructor(){
    }

    ngOnInit() {
        this.getMapDocument();
        this.zoomMap();
    }

    getItem(event: MouseEvent, item:ItemType){
        this.modal.closeModalIfOpened();
        this.modal.openModal();
        this.modal.setModalPosition(event);
        this.modal.getItemById(ClickedElementListener.getClickedElementId(event), item);
    }

    zoomMap(){
        var mapItems = document.getElementById('mapItems');
        var limitPan = function(oldPan, newPan){
            var gutterWidth = 1024
                , gutterHeight = 790
                , sizes = this.getSizes()
                , leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth
                , rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom)
                , topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight
                , bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom);
            var customPan = {x:0,y:0};
            customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
            customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
            return customPan
        };
        var svg = svgPanZoom('#mapSvg',  {
            viewportSelector: '.svg-pan-zoom_viewport'
            , controlIconsEnabled: true
            , dblClickZoomEnabled: false
            , zoomScaleSensitivity: 0.2
            , minZoom: 1
            , maxZoom: 5
            , fit: true
            , center: true
            , beforePan:limitPan
            , onZoom: function(){
            }
            ,onPan: function(){
            }
        });
    }

    getIdsFromMap(){
        var paths = this.getMapDocument();
        var tempIds = [];
        for(var _i = 0; _i < paths.length; _i++){
            tempIds.push(paths[_i].id);
        }
        return tempIds;
    }

    public getMapDocument(){
        return document.getElementsByTagName("path");
    }
}