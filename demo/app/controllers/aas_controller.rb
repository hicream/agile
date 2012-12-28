class AasController < ApplicationController
  # GET /aas
  # GET /aas.json
  def index
    @aas = Aa.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @aas }
    end
  end

  # GET /aas/1
  # GET /aas/1.json
  def show
    @aa = Aa.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @aa }
    end
  end

  # GET /aas/new
  # GET /aas/new.json
  def new
    @aa = Aa.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @aa }
    end
  end

  # GET /aas/1/edit
  def edit
    @aa = Aa.find(params[:id])
  end

  # POST /aas
  # POST /aas.json
  def create
    @aa = Aa.new(params[:aa])

    respond_to do |format|
      if @aa.save
        format.html { redirect_to @aa, notice: 'Aa was successfully created.' }
        format.json { render json: @aa, status: :created, location: @aa }
      else
        format.html { render action: "new" }
        format.json { render json: @aa.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /aas/1
  # PUT /aas/1.json
  def update
    @aa = Aa.find(params[:id])

    respond_to do |format|
      if @aa.update_attributes(params[:aa])
        format.html { redirect_to @aa, notice: 'Aa was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @aa.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /aas/1
  # DELETE /aas/1.json
  def destroy
    @aa = Aa.find(params[:id])
    @aa.destroy

    respond_to do |format|
      format.html { redirect_to aas_url }
      format.json { head :no_content }
    end
  end
end
