yc.outer.PlayerLayer = cc.Layer.extend({  
	  
	ctor: function  () {  

		this._super() ;

		if(typeof this.setKeyboardEnabled!='undefined')
		{
			this.setKeyboardEnabled(true);  
		}
		this.setTouchEnabled(true);

		this.setAnchorPoint(cc.p(0,0)) ;

		this.cell = ins(yc.outer.Cell) ;
		outerCell = this.cell ;

		this.hMoving = 0 ;
		this.vMoving = 0 ;
		
		this.followPoint = false ;
		this.dontMoving = false ;

		//细胞头部是否面向光标
		this.setNeedFaceToPoint(true) ;
	}

	, onEnter: function(){
		this._super() ;

		this.cell.init() ;
		this.addChild(this.cell) ;
	}

	, onTouchesBegan: function(touches, event){
		if(!this.dontMoving)
		{
			this.followPoint = true ;
			this.cell.run(4) ;
			this.onTouchesMoved(touches, event) ;
		}
	}
	
	, onTouchesMoved: function(touches, event){
		var cellPos = this.cell.getPosition() ;
		var touchPos = yc.util.windowToClient(this,touches[0]._point.x,touches[0]._point.y) ;

		var innerCell = ins(yc.inner.Cell) ;
		if( innerCell.farthest )
		{
			if( yc.util.pointsDis(0,0,touchPos[0],touchPos[1]) < yc.util.pointsDis(0,0,innerCell.farthest.center[0],innerCell.farthest.center[1]) + yc.settings.inner.hexgonSideLength )
			{
				return ;
			}
		}

		var radianBetweenPoints = yc.util.radianBetweenPoints(
			cellPos.x
			,cellPos.y
			,touchPos[0]
			,touchPos[1]
		) ;

		if(this.getNeedFaceToPoint()){
			this.cell.rotationTarget = radianBetweenPoints;
		}

		if(!this.dontMoving)
		{
			if(this.followPoint)
			{
				this.cell.direction = radianBetweenPoints;
				this.cell.updateVelocity() ;
			}
		}
		
	}
	, onTouchesEnded:function (touches, event) {
		if(!this.dontMoving)
		{
			this.followPoint = false ;
			this.cell.stopRun() ;
		}
	}
	
	, onKeyUp:function (e) {
		switch(e.keyCode)
		{
			// left
			case 65 : // s
			case 37 :
				var prop = 'hMoving' ;
				var v = -1 ;
				break;
			
			// up
			case 87 : // w
			case 38 :
				var prop = 'vMoving' ;
				var v = 1 ;
				break;
				
			// right
			case 68 : // d
			case 39 :
				var prop = 'hMoving' ;
				var v = 1 ;
				break;

			// down
			case 83 : // s 
			case 40 :
				var prop = 'vMoving' ;
				var v = -1 ;
				break;

			// 其他按键 跳过 updateCellMoving()
			default:
				return ;
		}

		if( this[prop]==v )
		{
			this[prop] = 0 ;
		}

		this.updateCellMoving() ;
	}
	
	, onKeyDown:function (e) {
		switch(e.keyCode)
		{
			// left
			case 65 : // s
			case 37 :
				this.hMoving = -1 ;
				break;
			
			// up
			case 87 : // w
			case 38 :
				this.vMoving = 1 ;
				break;
				
			// right
			case 68 : // d
			case 39 :
				this.hMoving = 1 ;
				break;

			// down
			case 83 : // s 
			case 40 :
				this.vMoving = -1 ;
				break;

			// 其他按键 跳过 updateCellMoving()
			default:
				return ;
		}

		this.updateCellMoving() ;
	}

	, updateCellMoving: function(){

		if(!this.hMoving&&!this.vMoving)
		{
			this.cell.stopRun() ;
		}
		else
		{
			this.cell.direction = yc.util.radianBetweenPoints(0,0,this.hMoving,this.vMoving) ;
			this.cell.run(4) ;
			this.cell.updateVelocity() ;
		}
	}
	, setNeedFaceToPoint : function(bNeed){
		this.bNeedFaceToPoint = Boolean(bNeed);
	}
	, getNeedFaceToPoint : function(){
		return Boolean( this.bNeedFaceToPoint );
	}
	
	//, transform: yc.cocos2d.patchs.Node.transform
});