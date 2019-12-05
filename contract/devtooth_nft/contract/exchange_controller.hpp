#pragma once

class exchnage_controller 
{
    private:
        name self;
        trade_table trade;
    public:
        /// Constructor
        exchnage_controller(name _self) : self(_self), trade(_self, _self) 
        {
        }    
}
